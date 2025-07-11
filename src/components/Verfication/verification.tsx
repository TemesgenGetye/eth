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

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: step === 'video-recording',
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  }, [step]);

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
    setTimeout(() => {
      initializeCamera();
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
      initializeCamera();
    }, 100);
  };

  const handleOpenCamera = () => {
    setStep('video-recording');
    // console.log('Opening camera for video recording');
    setTimeout(() => {
      initializeCamera();
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
          <div className="relative flex w-full max-w-lg flex-col items-center rounded-2xl bg-white p-8 text-gray-800 shadow-xl">
            {/* Illustration */}
            <div className="mb-4 flex justify-center">
              <img
                src="/user.gif"
                alt="Get Verified Illustration"
                className="h-32 w-48 object-contain"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}
              />
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              {t('common.getVerifiedOn888Market')}
            </h2>
            <div className="mb-2 flex flex-row items-center justify-center gap-2 text-center text-base font-medium text-gray-700">
              <span className="text-sm">{t('common.buildTrust')}</span>
              <span className="mx-1 text-lg font-bold">•</span>
              <span className="text-sm">{t('common.gainVisibility')}</span>
              <span className="mx-1 text-lg font-bold">•</span>
              <span className="text-sm">{t('common.unlockRewards')}</span>
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

            <div className="mt-5 flex w-full justify-end gap-3">
              <button
                className="rounded-lg border border-gray-300 bg-white px-8 py-2 font-medium text-gray-700 hover:bg-gray-100"
                onClick={handleClose}
              >
                {t('common.later')}
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white hover:bg-blue-700"
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
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 text-gray-800 shadow-xl">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-6 text-center text-xl font-bold">
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
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-150 ${
                  selectedIdType === 'emirates'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => handleIdTypeSelect('emirates')}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
                    <span className="text-xs text-white">ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {t('common.emiratesId')}
                    </span>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
                      {t('common.recommended')}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
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
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-150 ${
                  selectedIdType === 'emirates'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => handleIdTypeSelect('emirates')}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-600">
                    <span className="text-xs text-white">PP</span>
                  </div>
                  <span className="font-semibold">
                    {t('common.passportAndResidenceVisa')}
                  </span>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
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

            <div className="flex w-full justify-end">
              <button
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
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
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-8 text-gray-800 shadow-xl">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-6 text-center text-xl font-bold">
              {t('common.takeFirstPhotoFront')}
            </h2>

            <div className="mb-6 flex w-full items-center">
              <div
                className="h-1 flex-1 rounded bg-blue-600"
                style={{ maxWidth: '50%' }}
              ></div>
              <div className="ml-1 h-1 flex-1 rounded bg-gray-200"></div>
            </div>

            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  1
                </div>
                <span className="text-sm font-semibold">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-600">
                  2
                </div>
                <span className="text-sm text-gray-500">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            <div className="mx-auto mb-8 flex h-[60%] w-[60%] justify-center rounded-2xl">
              <img
                src="/id_front.png"
                alt="Emirates ID illustration"
                className="rounded-lg shadow-md"
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
            <div className="flex w-full justify-end">
              <button
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-3  text-sm font-semibold text-white hover:bg-blue-700"
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
          <div className="relative w-full max-w-2xl  rounded-xl bg-white p-4 text-gray-800 shadow-lg">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-4 text-center text-xl font-bold">
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

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
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
                <span className="text-sm font-semibold">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                    currentPhotoType === 'back'
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="text-sm text-gray-500">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            {cameraError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-blue-600">{cameraError}</p>
                <button
                  className="mt-2 text-sm text-blue-600 underline"
                  onClick={initializeCamera}
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
                  className="h-64 w-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                  onClick={capturePhoto}
                >
                  <Camera className="h-4 w-4" />
                  {t('common.capture')}
                </button>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.positionIdClearly')}</span>
            </div>
          </div>
        );
      case 'camera-back':
        return (
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-4 text-gray-800 shadow-lg">
            <h2 className="mb-4 text-center text-xl font-bold">
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

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
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
                <span className="text-sm font-semibold">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                    currentPhotoType === 'back'
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="text-sm text-gray-500">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            {cameraError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{cameraError}</p>
                <button
                  className="mt-2 text-sm text-red-600 underline"
                  onClick={initializeCamera}
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
                  className="h-64 w-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                  onClick={capturePhoto}
                >
                  <Camera className="h-4 w-4" />
                  {t('common.capture')}
                </button>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.positionIdClearly')}</span>
            </div>
          </div>
        );

      case 'photo-captured':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-6 text-gray-800 shadow-lg">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-4 text-center text-xl font-bold">
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
                  className="absolute bottom-2 left-2 rounded bg-black bg-opacity-50 px-3 py-1 text-sm text-white hover:bg-opacity-70"
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

            <div className="flex gap-4">
              <button
                className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50"
                onClick={handleTryAgain}
              >
                {t('common.tryAgain')}
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
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
          <div className="relative w-full max-w-xl rounded-xl bg-white p-8 text-gray-800 shadow-lg">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="mb-6 text-center text-xl font-bold">
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

            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm text-gray-500">
                  {t('common.frontOfId')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  2
                </div>
                <span className="text-sm font-semibold">
                  {t('common.backOfId')}
                </span>
              </div>
            </div>

            <div className="mx-auto mb-8 flex h-[60%] w-[60%] justify-center rounded-2xl">
              <img
                src="/id_back.png"
                alt="Emirates ID back illustration"
                className="rounded-lg shadow-md"
              />
            </div>

            <div className="mb-6 flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span>{t('common.ensureDetailsClear')}</span>
            </div>

            <div className="flex w-full justify-end">
              <button
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={() => handleTakePhoto('back')}
              >
                <Camera className="h-5 w-5" />
                {t('common.takePhoto')}
                <span>→</span>
              </button>
            </div>
          </div>
        );

      case 'video-intro':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-8 text-gray-800 shadow-lg">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="mb-6 text-center text-xl font-bold">
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

            <h3 className="mb-4 text-lg font-semibold">
              {t('common.recordVideoToCompleteVerification')}
            </h3>

            <p className="mb-6 text-gray-600">
              {t('common.positionFaceInCenterVideo')}
            </p>

            <div className="mb-6">
              <h4 className="mb-2 font-semibold">{t('common.videoExample')}</h4>
              <div className="flex justify-center rounded-lg p-4">
                <img
                  src="/person.png"
                  alt="Video example"
                  className="h-80 w-full rounded-lg"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              onClick={handleOpenCamera}
            >
              <Video className="h-5 w-5" />
              {t('common.openCamera')}
              <span>→</span>
            </button>
          </div>
        );

      case 'video-recording':
        return (
          <div className="relative w-full max-w-xl rounded-xl bg-white p-6 text-gray-800 shadow-lg">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="mb-4 text-center text-xl font-bold">
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

            <p className="mb-4 text-center text-gray-600">
              {t('common.ensureFaceInCentreVideo')}
            </p>

            {isRecording && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3">
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
                  className="mt-2 text-sm text-red-600 underline"
                  onClick={initializeCamera}
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
                  className="h-64 w-full object-cover"
                />
                <button
                  className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold ${
                    isRecording
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handleRecord}
                >
                  <Video className="h-4 w-4" />
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
                    className="mx-auto max-h-64 w-auto rounded-lg object-contain shadow-sm"
                  />
                </div>
              )}

            <button
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold ${
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
          <div className="relative w-full max-w-xl rounded-xl bg-white p-8 text-gray-800 shadow-lg">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
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
              <h2 className="mb-4 text-2xl font-bold">
                {t('common.uploading')} {uploadProgress}%
              </h2>

              {(capturedMedia.frontPhoto ||
                capturedMedia.backPhoto ||
                capturedMedia.videoFrames) && (
                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-sm text-gray-600">
                    {t('common.submittedMedia')}:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
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
          <div className="relative w-full max-w-xl rounded-xl bg-white p-8 text-gray-800 shadow-lg">
            <div className="text-center">
              <div className="mb-10 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <h2 className="mb-6 text-2xl font-bold">
                {t('common.verificationRequestSubmitted')}
              </h2>

              <div className="mb-6 text-left">
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
                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-sm text-gray-600">
                    {t('common.submittedMedia')}:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
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

              <button
                className="w-full rounded-lg bg-gray-800 py-3 font-semibold text-white hover:bg-gray-900"
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
      <div className="flex w-full items-center justify-center gap-4 bg-blue-100 px-6 py-1">
        <div className="flex w-full max-w-lg animate-pulse items-center gap-4">
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

  if (customer?.verification_status === 'verified') return null;
  return (
    <>
      <div className=" hidden w-full items-center justify-center gap-4 bg-blue-500 px-6 py-2 text-white md:flex">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <span className="text-lg font-bold">
            <CircleCheckBig />
          </span>
          <span className="text-sm md:text-sm">
            {t('common.joinUsBuildingSafer')}
          </span>
        </div>
        <button
          className="ml-4 rounded-xl px-5 py-1 text-sm text-white ring-1 ring-white transition-colors hover:bg-blue-100 hover:text-blue-600"
          onClick={() => setOpen(true)}
        >
          {t('common.verifyNow')}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
          {renderModalContent()}
        </div>
      )}
    </>
  );
};

export default VerificationBar;
