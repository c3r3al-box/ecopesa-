import Head from 'next/head'

export default function CollectionCenters() {
  return (
    <>
      <Head>
        <title>EcoPesa - Collection Centers</title>
      </Head>

      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button title="Back" aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Collection Centers</h1>
            </div>
            <button className="p-2 rounded-full bg-emerald-700" title="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-4">
          {/* Map Placeholder */}
          <div className="bg-emerald-200 rounded-lg h-64 mb-6 flex items-center justify-center">
            <span className="text-emerald-800 font-medium">Map View</span>
          </div>

          {/* Nearby Centers */}
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Nearby Centers</h2>
          
          <div className="space-y-4">
            {/* Center Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Green Recycling Hub</h3>
                  <p className="text-gray-600 text-sm">2.5km away</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">Open</span>
              </div>
              <p className="text-gray-700 mt-2">123 Eco Street, Greenville</p>
              <p className="text-gray-700">Open: 8AM - 6PM</p>
              <button className="mt-3 text-emerald-600 font-medium text-sm flex items-center">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Center Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Eco Collection Point</h3>
                  <p className="text-gray-600 text-sm">3.1km away</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">Open</span>
              </div>
              <p className="text-gray-700 mt-2">456 Nature Road, Greenville</p>
              <p className="text-gray-700">Open: 7AM - 7PM</p>
              <button className="mt-3 text-emerald-600 font-medium text-sm flex items-center">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}