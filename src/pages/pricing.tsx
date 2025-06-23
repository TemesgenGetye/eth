import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Context/Languge';

export default function Pricing() {
  const navigate = useNavigate();

  const handleSelectPlan = async (planName: string, basePrice: number) => {
    navigate(`/subscription?plan=${planName}&basePrice=${basePrice}`);
  };

  const { t } = useLanguage();

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
            {t('common.pricing.selectPackage')}
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Lite Plan */}
          <Card className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <CardHeader className="border-b border-gray-200 pb-4 ">
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('common.pricing.lite')}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">
                    {t('common.aed')}
                  </span>
                  <span className="text-4xl font-bold text-gray-900">229</span>
                  <span className="text-sm text-gray-600">*</span>
                </div>
              </CardHeader>
              <CardContent className="mt-2 space-y-6">
                <div>
                  <h4 className="mb-3 font-medium text-gray-900">
                    {t('common.pricing.whatsIncluded')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {t('common.pricing.adLiveDays30')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {t('common.pricing.refresh1')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
            <div className="px-4">
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() =>
                  handleSelectPlan(t('common.pricing.selectLite'), 229)
                }
              >
                {t('common.pricing.selectLite')}
              </Button>
            </div>
          </Card>

          {/* Basic Plan - Recommended */}
          <Card className="relative border-2 border-blue-200 bg-blue-50 bg-[linear-gradient(to_right,rgba(89,138,237,0.185),rgba(62,122,244,0.115))] p-3 shadow-lg">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform border-b border-gray-200 bg-blue-900 px-4 py-1 text-white">
              {t('common.pricing.recommended')}
            </Badge>
            <CardHeader className="pb-4 pt-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {t('common.pricing.basic')}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-600">{t('common.aed')}</span>
                <span className="text-4xl font-bold text-gray-900">289</span>
                <span className="text-sm text-gray-600">*</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-3 font-medium text-gray-900">
                  {t('common.pricing.whatsIncluded')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.adLiveDays30')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.featuredDays7')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.refresh2')}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium text-gray-900">
                  {t('common.pricing.whyBasic')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.moreViewsLite')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.moreLeadsLite')}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-blue-900 text-white hover:bg-blue-800"
                onClick={() =>
                  handleSelectPlan(t('common.pricing.selectBasic'), 209)
                }
              >
                {t('common.pricing.selectBasic')}
              </Button>
            </CardContent>
          </Card>

          {/* Extended Plan */}
          <Card className="relative border border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {t('common.pricing.extended')}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-600">{t('common.aed')}</span>
                <span className="text-4xl font-bold text-gray-900">409</span>
                <span className="text-sm text-gray-600">*</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-3 font-medium text-gray-900">
                  {t('common.pricing.whatsIncluded')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.adLiveDays60')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.featuredDays14')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.refresh4')}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium text-gray-900">
                  {t('common.pricing.whyExtended')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.moreViewsBasic')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t('common.pricing.moreLeadsBasic')}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() =>
                  handleSelectPlan(t('common.pricing.selectExtended'), 409)
                }
              >
                {t('common.pricing.selectExtended')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-sm text-gray-500">
          {t('common.pricing.vatNote')}
        </p>
      </div>
    </div>
  );
}
