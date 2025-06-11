import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>EcoPesa - Recycle & Earn</title>
        <meta name="description" content="Earn rewards for recycling with EcoPesa" />
      </Head>

      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">EcoPesa</h1>
            <div className="flex space-x-4">
              <button
                className="p-2 rounded-full bg-emerald-700"
                aria-label="User Profile"
                title="User Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-8 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Recycle & Earn Rewards</h2>
            <p className="mb-6">Turn your waste into EcoPesa points and redeem exciting rewards</p>
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
              Start Recycling
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h3 className="text-2xl font-bold text-emerald-800 mb-8 text-center">How It Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-emerald-600 text-2xl font-bold">1</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Collect Recyclables</h4>
                <p className="text-gray-600">Gather plastic, glass, paper and other recyclable materials</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-emerald-600 text-2xl font-bold">2</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Drop at Center</h4>
                <p className="text-gray-600">Visit any EcoPesa collection center near you</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-emerald-600 text-2xl font-bold">3</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Earn Rewards</h4>
                <p className="text-gray-600">Get EcoPesa points redeemable for cash or gifts</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 bg-emerald-100">
          <div className="container mx-auto text-center">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Ready to Recycle?</h3>
            <p className="mb-6 text-gray-700 max-w-2xl mx-auto">Join thousands of people already earning from their waste</p>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-emerald-700 transition">
              Find a Collection Center
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-emerald-800 text-white p-6">
          <div className="container mx-auto text-center">
            <p>© {new Date().getFullYear()} EcoPesa. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}