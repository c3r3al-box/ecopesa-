'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-emerald-800 mb-4">
            About EcoPesa
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Building a transparent, rewarding recycling ecosystem across Kenya.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-emerald-700 mb-3">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a cleaner, greener Kenya where recycling is not just a responsibility
            but a rewarding habit. By integrating spatial technology and mobile payments,
            EcoPesa empowers communities to recycle more and earn more.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-emerald-700 mb-3">How It Works</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Users drop off materials at assigned collection centres.</li>
            <li>Recyclers and admins verify logs to ensure transparency.</li>
            <li>Users earn EcoPesa points for verified recycling activities.</li>
            <li>Points can be redeemed for cash via M-Pesa or other rewards.</li>
          </ul>
        </div>

        {/* Why EcoPesa */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-emerald-700 mb-3">Why EcoPesa?</h2>
          <p className="text-gray-700 leading-relaxed">
            EcoPesa bridges the gap between environmental responsibility and everyday incentives.
            By rewarding recycling, we make sustainability accessible and impactful for everyone —
            from households to businesses.
          </p>
        </div>

        {/* Closing CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">
            Together, we can build a future where recycling fuels both community growth and
            environmental sustainability.
          </p>
          <a
            href="/auth"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            Join EcoPesa
          </a>
        </div>
      </div>
    </div>
  );
}
