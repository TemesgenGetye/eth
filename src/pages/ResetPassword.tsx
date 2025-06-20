import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabase';
import toast from 'react-hot-toast';
import { useLanguage } from '../Context/Languge';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (password.length < 6) {
      setError(t('common.passwordMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('common.passwordsDoNotMatch'));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        toast.success(t('common.passwordUpdated'));
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: unknown) {
      setError((err as Error).message || t('common.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('common.resetPassword')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('common.enterNewPassword')}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-lg">
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-2 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded border border-green-200 bg-green-50 p-2 text-green-700">
              {t('common.passwordUpdatedRedirecting')}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t('common.newPassword')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={t('common.enterNewPasswordPlaceholder')}
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t('common.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={t('common.confirmNewPassword')}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t('common.updating') : t('common.updatePassword')}
            </button>
          </form>
        </div>
        <div className="text-center text-xs text-gray-500">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-500 hover:underline"
          >
            {t('common.backToLogin')}
          </a>
        </div>
      </div>
    </div>
  );
}
