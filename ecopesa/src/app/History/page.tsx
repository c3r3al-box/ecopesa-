import Head from 'next/head'

export default function History() {
  return (
    <>
      <Head>
        <title>EcoPesa - Recycling History</title>
      </Head>

      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Recycling History</h1>
            <button
              className="p-2 rounded-full bg-emerald-700"
              title="Open menu"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="p-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-emerald-800">This Month</h2>
              <label htmlFor="month-select" className="sr-only">
                Select month
              </label>
              <select
                id="month-select"
                className="border border-emerald-200 rounded px-2 py-1 text-sm"
                aria-label="Select month"
              >
                <option>June 2023</option>
                <option>May 2023</option>
                <option>April 2023</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-600 text-sm">Recycling Trips</p>
                <p className="text-xl font-bold text-emerald-600">4</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Items Recycled</p>
                <p className="text-xl font-bold text-emerald-600">28</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Points Earned</p>
                <p className="text-xl font-bold text-emerald-600">560</p>
              </div>
            </div>
          </div>
        </section>

        {/* History List */}
        <section className="p-4">
          <h2 className="font-bold text-emerald-800 mb-3">Recent Activity</h2>
          
          <div className="space-y-3">
            {/* History Item */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">Green Recycling Hub</h3>
                  <p className="text-gray-600 text-sm">June 15, 2023 • 2:45 PM</p>
                </div>
                <span className="text-emerald-600 font-bold">+140 pts</span>
              </div>
              <div className="mt-2 text-sm">
                <p>5 Plastic Bottles • 3 Glass Bottles • 2kg Paper</p>
              </div>
            </div>

            {/* History Item */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">Eco Collection Point</h3>
                  <p className="text-gray-600 text-sm">June 8, 2023 • 10:30 AM</p>
                </div>
                <span className="text-emerald-600 font-bold">+210 pts</span>
              </div>
              <div className="mt-2 text-sm">
                <p>8 Plastic Bottles • 5 Aluminum Cans • 1kg Cardboard</p>
              </div>
            </div>

            {/* History Item */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">Green Recycling Hub</h3>
                  <p className="text-gray-600 text-sm">June 1, 2023 • 4:15 PM</p>
                </div>
                <span className="text-emerald-600 font-bold">+120 pts</span>
              </div>
              <div className="mt-2 text-sm">
                <p>4 Plastic Bottles • 2 Glass Bottles • 3kg Paper</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}