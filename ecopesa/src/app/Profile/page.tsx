import Head from 'next/head'

export default function Profile() {
  return (
    <>
      <Head>
        <title>EcoPesa - My Profile</title>
      </Head>

      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">My Profile</h1>
            <button className="p-2 rounded-full bg-emerald-700" title="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..." />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Profile Section */}
        <section className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100 text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-emerald-800">John Doe</h2>
            <p className="text-gray-600">john.doe@example.com</p>

            <div className="mt-4 bg-emerald-100 rounded-full py-2 px-4 inline-block">
              <span className="text-emerald-800 font-medium">Member since June 2022</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-4">My Recycling Stats</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Items Recycled</span>
                  <span className="font-bold text-emerald-600">156</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Points Earned</span>
                  <span className="font-bold text-emerald-600">3,120</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-3/5"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Carbon Footprint Reduced</span>
                  <span className="font-bold text-emerald-600">78 kg</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="p-6 mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden">
            <button className="w-full p-4 text-left border-b border-emerald-100 flex justify-between items-center hover:bg-emerald-50">
              <span>My Collection Centers</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full p-4 text-left border-b border-emerald-100 flex justify-between items-center hover:bg-emerald-50">
              <span>Payment Methods</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full p-4 text-left border-b border-emerald-100 flex justify-between items-center hover:bg-emerald-50">
              <span>Notifications</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full p-4 text-left flex justify-between items-center hover:bg-emerald-50 text-red-500">
              <span>Log Out</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
