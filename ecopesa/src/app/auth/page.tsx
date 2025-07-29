// app/auth/page.tsx
'use client';
import Link from 'next/link';

export default function AuthLanding() {
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="text-gray-600">Choose how you want to get started:</p>
      
      <div className="flex gap-4">
        <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Log In
        </Link>
        <Link href="/auth/signup" className="px-4 py-2 bg-green-600 text-white rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
