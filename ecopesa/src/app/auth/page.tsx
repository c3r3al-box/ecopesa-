'use client';
import Link from 'next/link';

export default function AuthLanding() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {/* Logo / Title */}
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-2">Welcome to EcoPesa</h1>
        <p className="text-gray-600 mb-8">
          Choose how you want to get started
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/auth/login"
            className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="w-full px-4 py-3 bg-gray-100 text-emerald-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-emerald-600"
          >
            Sign Up
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-400">
          RECYCLING IS FUN. LETS CLEAN UP THE PLANET TOGETHER!
        </p>
      </div>
    </div>
  );
}
