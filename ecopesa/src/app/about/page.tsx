'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">About EcoPesa</h1>

        <p className="text-gray-700 mb-4">
          EcoPesa is a community-driven recycling rewards platform designed to make recycling
          practical, rewarding, and scalable across Kenya. Our mission is to connect recyclers,
          collectors, and communities through technology, creating a transparent and impactful
          recycling ecosystem.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700 mt-6 mb-2">Our Vision</h2>
        <p className="text-gray-700 mb-4">
          We envision a cleaner, greener Kenya where recycling is not just a responsibility but
          a rewarding habit. By integrating spatial technology and mobile payments, EcoPesa
          empowers communities to recycle more and earn more.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700 mt-6 mb-2">How It Works</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Recyclers drop off materials at assigned collection centres.</li>
          <li>Collectors and admins verify logs to ensure transparency.</li>
          <li>Users earn EcoPesa points for verified recycling activities.</li>
          <li>Points can be redeemed for cash via M-Pesa or other rewards.</li>
        </ul>

        <h2 className="text-xl font-semibold text-emerald-700 mt-6 mb-2">Why EcoPesa?</h2>
        <p className="text-gray-700 mb-4">
          EcoPesa bridges the gap between environmental responsibility and everyday incentives.
          By rewarding recycling, we make sustainability accessible and impactful for everyone —
          from households to businesses.
        </p>

        <p className="text-gray-600 mt-8 text-sm">
          Together, we can build a future where recycling fuels both community growth and
          environmental sustainability.
        </p>
      </div>
    </div>
  );
}
