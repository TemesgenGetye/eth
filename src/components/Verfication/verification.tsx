'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  CircleCheckBig,
  X,
  Check,
  ChevronDown,
  Camera,
  Video,
  ThumbsUp,
  ShieldCheck,
} from 'lucide-react';
import supabase from '../../services/supabase';
import { useGetCustomer, useUpdateCustomer } from '../../hooks/useCustomers';
import { useAuth } from '../../Context/AuthContext';
import { useLanguage } from '../../Context/Languge';

import { useVerficationModal } from '../../Context/VerficationModal';

type VerificationStep =
  | 'initial'
  | 'id-selection'
  | 'front-photo'
  | 'back-photo'
  | 'photo-captured'
  | 'camera-front'
  | 'camera-back'
  | 'uploading'
  | 'video-intro'
  | 'video-recording'
  | 'success';

/** Phones/tablets (touch-primary): ID photos use rear camera; selfie video uses front. Desktop keeps user-facing webcam. */
function shouldApplyMobileCameraFacing(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function getFacingModeForStep(step: VerificationStep): 'user' | 'environment' {
  if (!shouldApplyMobileCameraFacing()) {
    return 'user';
  }
  if (step === 'camera-front' || step === 'camera-back') {
    return 'environment';
  }
  if (step === 'video-recording') {
    return 'user';
  }
  return 'user';
}

interface CapturedMedia {
  frontPhoto?: string;
  backPhoto?: string;
  videoFrames?: string[];
  videoBlob?: Blob;
}

const VerificationBar = () => {
  const { t } = useLanguage();
  const { open, setOpen } = useVerficationModal();
  const [step, setStep] = useState<VerificationStep>('initial');
  const [selectedIdType, setSelectedIdType] = useState<'emirates' | 'passport'>(
    'emirates'
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<CapturedMedia>({});
  const [currentPhotoType, setCurrentPhotoType] = useState<'front' | 'back'>(
    'front'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Refs for camera functionality
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopVideoRecordingCalled = useRef(false);

  // const { customers } = useCustomers();
  // const navigate = useNavigate();

  const { updateCustomerMutate } = useUpdateCustomer();
  const { user } = useAuth();

  const { customer, isLoadingCustomer } = useGetCustomer(
    user?.identities?.at(0)?.user_id as string
  );

  // const filterdCustomers = customers?.filter(
  //   (customer) => customer.uuid === user?.identities?.at(0)?.user_id
  // );

  // console.log('filterdCustomers', filterdCustomers);

  // Initialize camera (pass forStep when opening after setState + setTimeout so constraints match the active flow)
  const initializeCamera = useCallback(
    async (forStep?: VerificationStep) => {
      try {
        setCameraError(null);
        const effectiveStep = forStep ?? step;
        const wantAudio = effectiveStep === 'video-recording';
        const facingMode = getFacingModeForStep(effectiveStep);

        const requestStream = (facing: 'user' | 'environment') =>
          navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: facing,
            },
            audio: wantAudio,
          });

        let stream: MediaStream;
        try {
          stream = await requestStream(facingMode);
        } catch (firstError) {
          if (
            facingMode === 'environment' &&
            (effectiveStep === 'camera-front' ||
              effectiveStep === 'camera-back')
          ) {
            console.warn(
              'Rear camera unavailable, falling back to user-facing camera',
              firstError
            );
            stream = await requestStream('user');
          } else {
            throw firstError;
          }
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Camera initialization failed:', error);
        setCameraError('Unable to access camera. Please check permissions.');
      }
    },
    [step]
  );

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // Store the captured photo
    setCapturedMedia((prev) => ({
      ...prev,
      [currentPhotoType === 'front' ? 'frontPhoto' : 'backPhoto']: imageData,
    }));

    // Move to captured state
    setStep('photo-captured');
    stopCamera();
  }, [currentPhotoType, stopCamera]);

  // Extract frame from video for preview
  const extractVideoFrame = useCallback((videoBlob: Blob) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    video.src = URL.createObjectURL(videoBlob);
    video.currentTime = 1; // Extract frame at 1 second

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedMedia((prev) => ({
        ...prev,
        videoFrames: [frameData],
      }));

      URL.revokeObjectURL(video.src);
    };
  }, []);

  // Stop video recording
  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setTimeout(() => {
        setIsRecording(false);
      }, 500);
    }
  }, [isRecording]);

  // Start video recording
  const startVideoRecording = useCallback(async () => {
    if (!streamRef.current) return;
    stopVideoRecordingCalled.current = false;
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        setCapturedMedia((prev) => ({
          ...prev,
          videoBlob: videoBlob,
        }));
        extractVideoFrame(videoBlob);
        // console.log('Video recording completed:', videoBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(1); // Start at 1

      let count = 1;
      recordingIntervalRef.current = setInterval(() => {
        count++;
        setRecordingTime(count);
        if (count >= 5) {
          if (!stopVideoRecordingCalled.current) {
            stopVideoRecordingCalled.current = true;
            stopVideoRecording();
          }
        }
      }, 1000);

      // console.log('Video recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [extractVideoFrame, stopVideoRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [stopCamera]);

  const handleClose = () => {
    stopCamera();
    setOpen(false);
    setStep('initial');
    setCapturedMedia({});
    setCameraError(null);
    // console.log('Modal closed');
  };

  const handleGetVerified = () => {
    setStep('id-selection');
    // console.log('Get Verified clicked - moving to ID selection');
  };

  const handleIdTypeSelect = (type: 'emirates' | 'passport') => {
    setSelectedIdType(type);
    // console.log('ID type selected:', type);
  };

  const handleContinueFromIdSelection = () => {
    setStep('front-photo');
    // console.log('Continuing from ID selection to front photo step');
  };

  const handleTakePhoto = (photoType: 'front' | 'back') => {
    setCurrentPhotoType(photoType);
    setStep(photoType === 'front' ? 'camera-front' : 'camera-back');
    // console.log(`Taking ${photoType} photo`);

    // Initialize camera when entering camera mode
    const cameraStep = photoType === 'front' ? 'camera-front' : 'camera-back';
    setTimeout(() => {
      initializeCamera(cameraStep);
    }, 100);
  };

  const handleConfirmPhoto = () => {
    if (currentPhotoType === 'front') {
      setStep('back-photo');
      // console.log('Front photo confirmed, moving to back photo');
    } else {
      setStep('uploading');
      // console.log('Back photo confirmed, starting upload');

      // Simulate upload progress
      // let progress = 0;
      // const interval = setInterval(() => {
      //   progress += 15;
      //   setUploadProgress(progress);

      //   if (progress >= 100) {
      //     clearInterval(interval);

      setStep('video-intro');
      // console.log('Upload complete, moving to video intro');

      //   }
      // }, 300);
    }
  };

  const handleTryAgain = () => {
    const cameraStep =
      currentPhotoType === 'front' ? 'camera-front' : 'camera-back';
    setStep(cameraStep);
    // console.log('Retrying photo capture');
    setTimeout(() => {
      initializeCamera(cameraStep);
    }, 100);
  };

  const handleOpenCamera = () => {
    setStep('video-recording');
    // console.log('Opening camera for video recording');
    setTimeout(() => {
      initializeCamera('video-recording');
    }, 100);
  };

  const handleRecord = () => {
    if (!isRecording) {
      startVideoRecording();
    } else {
      stopVideoRecording();
    }
  };

  // automatically stop recording after 5 seconds
  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        stopVideoRecording();
      }, 5000);
    }
  }, [isRecording, stopVideoRecording]);

  const handleSubmitVideo = async () => {
    setStep('uploading');
    setUploadProgress(0);
    // console.log('Upload starting', capturedMedia);

    // Helper to convert base64 to Blob
    function base64ToBlob(base64: string, type = 'image/jpeg') {
      if (!base64 || !base64.startsWith('data:')) {
        throw new Error('Invalid base64 string');
      }
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type });
    }

    // Prepare files
    const files: {
      key: string;
      file: Blob;
      ext: string;
      contentType: string;
    }[] = [];
    if (capturedMedia.frontPhoto) {
      try {
        const blob = base64ToBlob(capturedMedia.frontPhoto, 'image/jpeg');
        if (blob.size === 0) throw new Error('Front photo Blob is empty');
        files.push({
          key: 'frontPhoto',
          file: blob,
          ext: 'jpg',
          contentType: 'image/jpeg',
        });
      } catch {
        alert('Front photo is invalid. Please retake.');
        setStep('front-photo');
        return;
      }
    }
    if (capturedMedia.backPhoto) {
      try {
        const blob = base64ToBlob(capturedMedia.backPhoto, 'image/jpeg');
        if (blob.size === 0) throw new Error('Back photo Blob is empty');
        files.push({
          key: 'backPhoto',
          file: blob,
          ext: 'jpg',
          contentType: 'image/jpeg',
        });
      } catch {
        alert('Back photo is invalid. Please retake.');
        setStep('back-photo');
        return;
      }
    }
    if (capturedMedia.videoBlob) {
      if (capturedMedia.videoBlob.size === 0) {
        alert('Video is empty. Please record again.');
        setStep('video-intro');
        return;
      }
      files.push({
        key: 'video',
        file: capturedMedia.videoBlob,
        ext: 'webm',
        contentType: 'video/webm',
      });
    }

    let completed = 0;
    const total = files.length;
    const uploadedUrls: Record<string, string> = {};

    // Upload all files in parallel, update progress
    await Promise.all(
      files.map(async ({ key, file, ext, contentType }) => {
        const filePath = `verification/${key}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(`customer/${filePath}`, file, {
            cacheControl: '3600',
            upsert: false,
            contentType,
          });
        if (!uploadError) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(`customer/${filePath}`);
          uploadedUrls[key] = data.publicUrl;
        }
        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
        // console.log(uploadError);
      })
    );

    setUploadProgress(100);
    // console.log('Uploaded file URLs:', uploadedUrls);

    updateCustomerMutate({
      id: customer?.id,
      id_front: uploadedUrls.frontPhoto,
      id_back: uploadedUrls.backPhoto,
      video_url: uploadedUrls.video,
      verification_status: 'requested',
    });

    //     {
    //     "backPhoto": "https://xkpwtumcrfeogammcewu.supabase.co/storage/v1/object/public/products/customer/verification/backPhoto-1749971630368-2acj92l1fhp.jpg",
    //     "frontPhoto": "https://xkpwtumcrfeogammcewu.supabase.co/storage/v1/object/public/products/customer/verification/frontPhoto-1749971630366-02vu76id79tq.jpg",
    //     "video": "https://xkpwtumcrfeogammcewu.supabase.co/storage/v1/object/public/products/customer/verification/video-1749971630369-lj3swgfx6sl.webm"
    // }

    setTimeout(() => {
      setStep('success');
    }, 500);
  };

  const handleFinalOk = () => {
    handleClose();
    // console.log('Verification process completed');
    // console.log('Final captured media:', capturedMedia);
  };

  const currentPhoto =
    currentPhotoType === 'front'
      ? capturedMedia.frontPhoto
      : capturedMedia.backPhoto;

  const renderModalContent = () => {
    switch (step) {
      case 'initial':
        return (
          <div className="relative flex w-full max-w-lg flex-col items-center rounded-2xl bg-white p-4 text-gray-800 shadow-xl sm:p-6 md:p-8">
            {/* Illustration */}
            <div className="mb-3 flex justify-center sm:mb-4">
              <img
                src="/user.gif"
                alt="Get Verified Illustration"
                className="h-24 w-40 object-contain sm:h-32 sm:w-48"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}
              />
            </div>
            <h2 className="mb-3 text-center text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
              {t('common.getVerifiedOn888Market')}
            </h2>
            <div className="mb-2 flex flex-col items-center gap-1 text-center text-sm font-medium text-gray-700 xs:flex-row xs:flex-wrap xs:justify-center xs:gap-x-2 xs:gap-y-1 sm:text-base">
              <span>{t('common.buildTrust')}</span>
              <span className="hidden xs:inline">•</span>
              <span>{t('common.gainVisibility')}</span>
              <span className="hidden xs:inline">•</span>
              <span>{t('common.unlockRewards')}</span>
            </div>
            <hr className="my-6 w-full border-white" />
            <div className="mb-6 flex w-full flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white ">
                  <ThumbsUp size={50} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {t('common.quickAndSimple')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('common.itOnlyTakesFewMinutes')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                  <ShieldCheck size={50} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {t('common.secure')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('common.yourIdInfoStaysPrivate')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 font-medium text-gray-700 hover:bg-gray-100 sm:w-auto sm:px-6 md:px-8"
                onClick={handleClose}
              >
                {t('common.later')}
              </button>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 sm:w-auto sm:px-6 md:px-8"
                onClick={handleGetVerified}
              >
                <span>{t('common.getVerified')}</span>
                <svg
                  width="18"
                  height="18"
                  className="-mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h8m0 0l-3-3m3 3l-3 3" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 'id-selection':
        return (
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 pt-12 text-gray-800 shadow-xl sm:p-6 sm:pt-14 md:p-8 md:pt-16">
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              type="button"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h2 className="mb-4 text-center text-lg font-bold sm:mb-6 sm:text-xl">
              {t('common.selectIdTypeToAdd')}
            </h2>
            {/* Progress bar */}
            <div className="mb-6 flex w-full items-center">
              <div
                className="h-1 flex-1 rounded bg-blue-600"
                style={{ maxWidth: '25%' }}
              ></div>
              <div className="ml-1 h-1 flex-1 rounded bg-gray-200"></div>
              <div className="ml-1 h-1 flex-1 rounded bg-gray-200"></div>
            </div>
            <p className="mb-6 text-center text-base text-gray-600">
              {t('common.weWillTake2Pictures')}
            </p>
            <div className="mb-6 space-y-4">
              <div
                className={`flex cursor-pointer flex-col gap-3 rounded-lg border p-3 transition-all duration-150 sm:flex-row sm:items-center sm:justify-between sm:p-4 ${
                  selectedIdType === 'emirates'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => handleIdTypeSelect('emirates')}
              >
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-800">
                    <span className="text-xs text-white">ID</span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1 xs:flex-row xs:items-center xs:gap-2">
                    <span className="font-semibold">
                      {t('common.emiratesId')}
                    </span>
                    <span className="w-fit rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
                      {t('common.recommended')}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center self-end rounded-full border-2 sm:self-auto ${
                    selectedIdType === 'emirates'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedIdType === 'emirates' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <div
                className={`flex cursor-pointer flex-col gap-3 rounded-lg border p-3 transition-all duration-150 sm:flex-row sm:items-center sm:justify-between sm:p-4 ${
                  selectedIdType === 'passport'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => handleIdTypeSelect('passport')}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-600">
                    <span className="text-xs text-white">PP</span>
                  </div>
                  <span className="font-semibold">
                    {t('common.passportAndResidenceVisa')}
                  </span>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center self-end rounded-full border-2 sm:self-auto ${
                    selectedIdType === 'passport'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedIdType === 'passport' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </div>
            <div className="mb-2 text-sm text-gray-600">
              <span className="text-[#888]">
                {t('common.verifiedExclusiveService')}
              </span>
            </div>
            <div className="mb-6 text-sm text-gray-600">
              <span className="text-[#888]">
                {t('common.preventsFakeAccounts')}
              </span>
            </div>

            <div className="flex w-full justify-stretch sm:justify-end">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto sm:px-6 md:px-8"
                onClick={handleContinueFromIdSelection}
              >
                <span>{t('common.continue')}</span>
                <svg
                  width="18"
                  height="18"
                  className="-mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h8m0 0l-3-3m3 3l-3 3" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 'front-photo':
        return (
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-4 pt-12 text-gray-800 shadow-xl sm:p-6 sm:pt-14 md:p-8 md:pt-16">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h2 className="mb-4 text-center text-lg font-bold sm:mb-6 sm:text-xl">
              {t('common.takeFirstPhotoFront')}
            </h2>

            <div className="mb-6 flex w-full items-center">
              <div
                className="h-1 flex-1 rounded bg-blue-600"
                style={{ maxWidth: '50%' }}
              ></div>
              <div className="ml-1 h-1 flex-1 rounded bg-gray-200"></div>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  1
                </div>
                <span className="text-sm font-semibold">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-600">
                  2
                </div>
                <span className="text-sm text-gray-500">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            <div className="mx-auto mb-6 flex w-full max-w-[280px] justify-center sm:mb-8 sm:max-w-xs md:max-w-sm">
              <img
                src="/id_front.png"
                alt="Emirates ID illustration"
                className="w-full rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="mb-6 flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.ensureDetailsClear')}</span>
            </div>
            {/* Try the app */}
            <div className="mb-6 flex cursor-pointer items-center gap-2 text-base text-gray-800">
              <span>{t('common.tryApp')}</span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
            {/* Take Photo Button */}
            <div className="flex w-full justify-stretch sm:justify-end">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto sm:px-5"
                onClick={() => handleTakePhoto('front')}
              >
                {t('common.takePhoto')}
                <svg
                  width="18"
                  height="18"
                  className="-mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h8m0 0l-3-3m3 3l-3 3" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 'camera-front':
        return (
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-3 pt-11 text-gray-800 shadow-lg sm:p-4 sm:pt-14">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h2 className="mb-3 text-center text-lg font-bold sm:mb-4 sm:text-xl">
              {currentPhotoType === 'front'
                ? t('common.takeFirstPhotoFront')
                : t('secondPhotoFlipId')}
            </h2>

            <div className="mb-4">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: currentPhotoType === 'front' ? '50%' : '75%',
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    currentPhotoType === 'front'
                      ? 'bg-black text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {currentPhotoType === 'front' ? (
                    '1'
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs font-semibold sm:text-sm">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    currentPhotoType === 'back'
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="text-xs text-gray-500 sm:text-sm">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            {cameraError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-blue-600">{cameraError}</p>
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 underline"
                  onClick={() => initializeCamera('camera-front')}
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            ) : (
              <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="aspect-[4/3] max-h-[min(50vh,18rem)] min-h-[12rem] w-full object-cover sm:aspect-auto sm:h-64 sm:max-h-none"
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  type="button"
                  className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-1rem)] -translate-x-1/2 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:bottom-4 sm:px-6"
                  onClick={capturePhoto}
                >
                  <Camera className="h-4 w-4 shrink-0" />
                  {t('common.capture')}
                </button>
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.positionIdClearly')}</span>
            </div>
          </div>
        );
      case 'camera-back':
        return (
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-3 pt-4 text-gray-800 shadow-lg sm:p-4">
            <h2 className="mb-3 text-center text-lg font-bold sm:mb-4 sm:text-xl">
              {currentPhotoType === 'front'
                ? t('common.takeFirstPhotoFront')
                : t('secondPhotoFlipId')}
            </h2>

            <div className="mb-4">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: currentPhotoType === 'front' ? '50%' : '75%',
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    currentPhotoType === 'front'
                      ? 'bg-black text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {currentPhotoType === 'front' ? (
                    '1'
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs font-semibold sm:text-sm">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    currentPhotoType === 'back'
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="text-xs text-gray-500 sm:text-sm">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            {cameraError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{cameraError}</p>
                <button
                  type="button"
                  className="mt-2 text-sm text-red-600 underline"
                  onClick={() => initializeCamera('camera-back')}
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            ) : (
              <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="aspect-[4/3] max-h-[min(50vh,18rem)] min-h-[12rem] w-full object-cover sm:aspect-auto sm:h-64 sm:max-h-none"
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  type="button"
                  className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-1rem)] -translate-x-1/2 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:bottom-4 sm:px-6"
                  onClick={capturePhoto}
                >
                  <Camera className="h-4 w-4 shrink-0" />
                  {t('common.capture')}
                </button>
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.positionIdClearly')}</span>
            </div>
          </div>
        );

      case 'photo-captured':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-4 pt-12 text-gray-800 shadow-lg sm:p-6 sm:pt-14">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h2 className="mb-3 text-center text-lg font-bold sm:mb-4 sm:text-xl">
              {currentPhotoType === 'front'
                ? t('common.frontPhotoCaptured')
                : t('common.backPhotoCaptured')}
            </h2>

            <div className="mb-4">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: currentPhotoType === 'front' ? '60%' : '85%',
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  {t('common.captured')}
                </span>
              </div>
              <div className="text-sm text-green-700">
                <p>
                  {currentPhotoType === 'front'
                    ? t('common.isFrontClear')
                    : t('common.isBackClear')}
                </p>
                <p>{t('common.isIdValid')}</p>
              </div>
            </div>

            {currentPhoto && (
              <div className="relative mb-4">
                <img
                  src={currentPhoto || '/placeholder.svg'}
                  alt={`Captured ${currentPhotoType} ID`}
                  className="w-full rounded-lg shadow-md"
                />
                <button
                  type="button"
                  className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70 sm:px-3 sm:text-sm"
                  onClick={handleTryAgain}
                >
                  {t('common.retake')}
                </button>
              </div>
            )}

            <div className="mb-4 flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.ensureDetailsClear')}</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-semibold hover:bg-gray-50 sm:flex-1 sm:py-2 sm:text-base"
                onClick={handleTryAgain}
              >
                {t('common.tryAgain')}
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-1 sm:py-2 sm:text-base"
                onClick={handleConfirmPhoto}
              >
                {t('common.confirm')}
                <span>→</span>
              </button>
            </div>
          </div>
        );

      case 'back-photo':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-4 pt-12 text-gray-800 shadow-lg sm:p-6 sm:pt-14 md:p-8 md:pt-16">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <h2 className="mb-4 text-center text-lg font-bold sm:mb-6 sm:text-xl">
              {t('common.secondPhotoFlipId')}
            </h2>

            <div className="mb-6">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm text-gray-500">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  2
                </div>
                <span className="text-sm font-semibold">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            <div className="mx-auto mb-6 flex w-full max-w-[280px] justify-center sm:mb-8 sm:max-w-xs md:max-w-sm">
              <img
                src="/id_back.png"
                alt="Emirates ID back illustration"
                className="w-full rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="mb-6 flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.ensureDetailsClear')}</span>
            </div>

            <div className="flex w-full justify-stretch sm:justify-end">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto sm:px-6 md:px-8"
                onClick={() => handleTakePhoto('back')}
              >
                <Camera className="h-5 w-5 shrink-0" />
                {t('common.takePhoto')}
                <span>→</span>
              </button>
            </div>
          </div>
        );

      case 'video-intro':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-4 pt-12 text-gray-800 shadow-lg sm:p-6 sm:pt-14 md:p-8 md:pt-16">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <h2 className="mb-4 text-center text-lg font-bold sm:mb-6 sm:text-xl">
              {t('common.almostThere')}
            </h2>

            <div className="mb-6">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              {t('common.recordVideoToCompleteVerification')}
            </h3>

            <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              {t('common.positionFaceInCenterVideo')}
            </p>

            <div className="mb-4 sm:mb-6">
              <h4 className="mb-2 text-sm font-semibold sm:text-base">
                {t('common.videoExample')}
              </h4>
              <div className="flex justify-center rounded-lg p-2 sm:p-4">
                <img
                  src="/person.png"
                  alt="Video example"
                  className="max-h-[min(42vh,20rem)] w-full rounded-lg object-contain sm:max-h-80"
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 font-semibold">{t('common.tip')}</h4>
              <p className="text-sm text-gray-600">
                {t('common.makeSureWellLitRoomPlainBackground')}
              </p>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:text-base"
              onClick={handleOpenCamera}
            >
              <Video className="h-5 w-5 shrink-0" />
              {t('common.openCamera')}
              <span>→</span>
            </button>
          </div>
        );

      case 'video-recording':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-4 pt-12 text-gray-800 shadow-lg sm:p-6 sm:pt-14">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <h2 className="mb-3 text-center text-lg font-bold sm:mb-4 sm:text-xl">
              {t('common.selfieVideo')}
            </h2>

            <div className="mb-4">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: '95%' }}
                ></div>
              </div>
            </div>

            <p className="mb-3 px-1 text-center text-sm text-gray-600 sm:mb-4 sm:text-base">
              {t('common.ensureFaceInCentreVideo')}
            </p>

            {isRecording && (
              <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-red-50 p-2.5 sm:mb-4 sm:p-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                <span className="text-sm font-semibold">
                  {t('common.recording')} {recordingTime}s / 5s
                </span>
              </div>
            )}

            {cameraError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{cameraError}</p>
                <button
                  type="button"
                  className="mt-2 text-sm text-red-600 underline"
                  onClick={() => initializeCamera('video-recording')}
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            ) : (
              <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="aspect-[4/3] max-h-[min(50vh,18rem)] min-h-[12rem] w-full object-cover sm:aspect-auto sm:h-64 sm:max-h-none"
                />
                <button
                  type="button"
                  className={`absolute bottom-3 left-1/2 flex max-w-[calc(100%-1rem)] -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold sm:bottom-4 sm:px-6 sm:text-sm ${
                    isRecording
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handleRecord}
                >
                  <Video className="h-4 w-4 shrink-0" />
                  {isRecording
                    ? t('common.stopRecording')
                    : t('common.startRecording')}
                </button>
              </div>
            )}

            {capturedMedia.videoFrames &&
              capturedMedia.videoFrames.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-600">
                    {t('common.videoPreview')}:
                  </p>
                  <img
                    src={capturedMedia.videoFrames[0] || '/placeholder.svg'}
                    alt="Video frame"
                    className="mx-auto max-h-48 w-auto rounded-lg object-contain shadow-sm sm:max-h-64"
                  />
                </div>
              )}

            <button
              type="button"
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold sm:text-base ${
                capturedMedia.videoBlob
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              onClick={() => handleSubmitVideo()}
              disabled={!capturedMedia.videoBlob}
            >
              {t('common.submitVideo')}
              <span>→</span>
            </button>
          </div>
        );

      case 'uploading':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-4 pt-12 text-gray-800 shadow-lg sm:p-6 sm:pt-14 md:p-8 md:pt-16">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 sm:right-4 sm:top-4"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="text-center">
              <div className="mb-6">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
              <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                {t('common.uploading')} {uploadProgress}%
              </h2>

              {(capturedMedia.frontPhoto ||
                capturedMedia.backPhoto ||
                capturedMedia.videoFrames) && (
                <div className="mb-6 rounded-lg bg-gray-50 p-3 sm:p-4">
                  <p className="mb-2 text-left text-sm text-gray-600">
                    {t('common.submittedMedia')}:
                  </p>
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:gap-2">
                    {capturedMedia.frontPhoto && (
                      <div>
                        <p className="text-xs text-gray-500">
                          {t('common.frontId')}
                        </p>
                        <img
                          src={capturedMedia.frontPhoto || './no-picture.png'}
                          alt="Front ID"
                          className="mx-auto h-auto max-h-40 w-full rounded object-cover"
                          style={{ aspectRatio: '4/3' }}
                        />
                      </div>
                    )}
                    {capturedMedia.backPhoto && (
                      <div>
                        <p className="text-xs text-gray-500">
                          {t('common.backId')}
                        </p>
                        <img
                          src={capturedMedia.backPhoto || './no-picture.png'}
                          alt="Back ID"
                          className="mx-auto h-auto max-h-40 w-full rounded object-cover"
                          style={{ aspectRatio: '4/3' }}
                        />
                      </div>
                    )}
                    {capturedMedia.videoFrames &&
                      capturedMedia.videoFrames[0] && (
                        <div>
                          <p className="text-xs text-gray-500">
                            {t('common.video')}
                          </p>
                          <img
                            src={
                              capturedMedia.videoFrames[0] || './no-picture.png'
                            }
                            alt="Video frame"
                            className="mx-auto h-auto max-h-40 w-full rounded object-cover"
                            style={{ aspectRatio: '4/3' }}
                          />
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-4 text-gray-800 shadow-lg sm:p-6 md:p-8">
            <div className="text-center">
              <div className="mb-6 flex justify-center sm:mb-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 sm:h-16 sm:w-16">
                  <Check className="h-7 w-7 text-blue-600 sm:h-8 sm:w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
                {t('common.verificationRequestSubmitted')}
              </h2>

              <div className="mb-6 text-start text-sm sm:text-base">
                <p className="mb-4 text-gray-600">
                  {t('common.requestBeingReviewed')}
                </p>
                <p className="mb-4 text-gray-600">
                  {t('common.reviewStatusFromProfile')}
                  <span className="cursor-pointer text-blue-500 underline">
                    {t('common.profileSection')}
                  </span>
                </p>
                <p className="mb-4 text-gray-600">{t('common.gotQuestions')}</p>
                <p className="cursor-pointer text-blue-500 underline">
                  {t('common.contactCustomerSupport')}
                </p>
              </div>

              {(capturedMedia.frontPhoto ||
                capturedMedia.backPhoto ||
                capturedMedia.videoFrames) && (
                <div className="mb-6 rounded-lg bg-gray-50 p-3 text-start sm:p-4">
                  <p className="mb-2 text-sm text-gray-600">
                    {t('common.submittedMedia')}:
                  </p>
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:gap-2">
                    {capturedMedia.frontPhoto && (
                      <div>
                        <p className="text-xs text-gray-500">
                          {t('common.frontId')}
                        </p>
                        <img
                          src={capturedMedia.frontPhoto || './no-picture.png'}
                          alt="Front ID"
                          className="mx-auto h-auto max-h-36 w-full rounded object-cover sm:max-h-40"
                          style={{ aspectRatio: '4/3' }}
                        />
                      </div>
                    )}
                    {capturedMedia.backPhoto && (
                      <div>
                        <p className="text-xs text-gray-500">
                          {t('common.backId')}
                        </p>
                        <img
                          src={capturedMedia.backPhoto || './no-picture.png'}
                          alt="Back ID"
                          className="mx-auto h-auto max-h-36 w-full rounded object-cover sm:max-h-40"
                          style={{ aspectRatio: '4/3' }}
                        />
                      </div>
                    )}
                    {capturedMedia.videoFrames &&
                      capturedMedia.videoFrames[0] && (
                        <div>
                          <p className="text-xs text-gray-500">
                            {t('common.video')}
                          </p>
                          <img
                            src={
                              capturedMedia.videoFrames[0] || './no-picture.png'
                            }
                            alt="Video frame"
                            className="mx-auto h-auto max-h-36 w-full rounded object-cover sm:max-h-40"
                            style={{ aspectRatio: '4/3' }}
                          />
                        </div>
                      )}
                  </div>
                </div>
              )}

              <button
                type="button"
                className="w-full rounded-lg bg-gray-800 py-3 text-sm font-semibold text-white hover:bg-gray-900 sm:text-base"
                onClick={handleFinalOk}
              >
                {t('common.ok')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoadingCustomer) {
    return (
      <div className="flex w-full items-center justify-center gap-4 bg-blue-100 px-3 py-2 sm:px-6 sm:py-1">
        <div className="flex w-full max-w-lg animate-pulse items-center gap-3 sm:gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-blue-200" />
            <div className="h-3 w-1/2 rounded bg-blue-200" />
          </div>
        </div>
      </div>
    );
  }
  console.log(customer?.verification_status);

  if (customer?.verification_status === 'verified' || 'requested') return null;
  return (
    <>
      <div className="flex w-full flex-col gap-3 bg-blue-500 px-3 py-2.5 text-white sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:px-4 md:px-6">
        <div className="flex items-start gap-3 sm:items-center md:gap-6">
          <span className="shrink-0 text-lg font-bold">
            <CircleCheckBig className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <span className="min-w-0 text-xs leading-snug sm:text-sm">
            {t('common.joinUsBuildingSafer')}
          </span>
        </div>
        <button
          className="w-full shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/80 transition-colors hover:bg-white/10 sm:ms-auto sm:w-auto sm:px-5 sm:py-1 md:ms-4"
          onClick={() => setOpen(true)}
        >
          {t('common.verifyNow')}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-[100dvh] w-full items-center justify-center p-3 py-6 sm:p-4 sm:py-8">
            <div className="relative w-full max-w-2xl shrink-0">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationBar;
