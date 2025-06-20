import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  const handleSelectPlan = async (planName: string, basePrice: number) => {
    navigate(`/subscription?plan=${planName}&basePrice=${basePrice}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          {/* <h1 className="mb-2 text-3xl font-bold text-gray-900"></h1> */}
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="logo" className="h-40 w-40" />
          </div>
          <h2 className="text-xl font-bold text-gray-700">
            Select a package that works for you
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Lite Plan */}
          <Card className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <CardHeader className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-900">Lite</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">AED</span>
                  <span className="text-4xl font-bold text-gray-900">229</span>
                  <span className="text-sm text-gray-600">*</span>
                </div>
              </CardHeader>
              <CardContent className="mt-6 space-y-6">
                <div>
                  <h4 className="mb-3 font-bold text-gray-900">
                    {"What's included"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Ad is live for 30 days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        1x Refresh that takes your ad to the top
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => handleSelectPlan('Lite', 229)}
            >
              Select Lite
            </Button>
          </Card>

          {/* Basic Plan - Recommended */}
          <Card className="relative flex flex-col justify-between rounded-lg border-2 border-blue-400 bg-white bg-[linear-gradient(2.46deg,rgba(173,216,230,0.225)39.06%,rgba(135,206,250,0.07)90%)] p-6 shadow-lg">
            <div>
              <div className="flex justify-between border-b border-gray-200">
                <CardHeader className=" pb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-600">AED</span>
                    <span className="text-4xl font-bold text-gray-900">
                      289
                    </span>
                    <span className="text-sm text-gray-600">*</span>
                  </div>
                </CardHeader>
                <Badge className="h-[40px] bg-blue-600 px-4 py-1 text-white">
                  RECOMMENDED
                </Badge>
              </div>
              <CardContent className="mt-6 space-y-6">
                <div>
                  <h4 className="mb-3 font-bold text-gray-900">
                    {"What's included"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        Ad is live for 30 days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        Featured for 7 days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        2x Refresh that takes your ad to the top
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-bold text-gray-900">Why Basic?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        60% more views vs Lite
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">
                        20% more leads vs Lite
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => handleSelectPlan('Basic', 289)}
            >
              Select Basic
            </Button>
          </Card>

          {/* Extended Plan */}
          <Card className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <CardHeader className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Extended
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">AED</span>
                  <span className="text-4xl font-bold text-gray-900">409</span>
                  <span className="text-sm text-gray-600">*</span>
                </div>
              </CardHeader>
              <CardContent className="mt-6 space-y-6">
                <div>
                  <h4 className="mb-3 font-bold text-gray-900">
                    {"What's included"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Ad is live for 60 days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Featured for 14 days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        4x Refresh that takes your ad to the top
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-bold text-gray-900">
                    Why Extended?
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        53% more views vs Basic
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        33% more leads vs Basic
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => handleSelectPlan('Extended', 409)}
            >
              Select Extended
            </Button>
          </Card>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-sm text-gray-500">
          *5% VAT will be charged in addition to the prices mentioned
        </p>
      </div>
    </div>
  );
}
