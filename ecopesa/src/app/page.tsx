'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
          Welcome to EcoPesa
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Earn rewards for recycling and make a real impact in your community 🌍
        </p>
      </div>

      {/* Call to Action */}
      <div className="flex gap-4">
        <Link
          href="/auth"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          Get Started
        </Link>
        <Link
          href="/about/about"
          className="bg-white border border-emerald-600 text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
