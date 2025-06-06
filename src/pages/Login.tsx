import type React from 'react';
import { useState } from 'react';
import { useLogin } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login.mutateAsync({ email, password });
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      // Implement Google OAuth login here
      console.log('Google login initiated');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle successful Google login
    } catch (error: any) {
      setError(error.message || 'Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-center text-2xl font-semibold text-gray-900">
              Sign in
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Card Content */}
          <div className="space-y-6 px-6 py-6">
            {/* Error Alert */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || login.isPending}
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 uppercase tracking-wide text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={login.isPending || isGoogleLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={login.isPending || isGoogleLoading}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={login.isPending || isGoogleLoading}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {login.isPending ? (
                  <>
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Sign in with Email
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <a
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-500 hover:underline"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-500 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
