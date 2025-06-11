import Head from 'next/head'

export default function Rewards() {
  return (
    <>
      <Head>
        <title>EcoPesa - Rewards</title>
      </Head>

      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">My Rewards</h1>
            <button className="p-2 rounded-full bg-emerald-700" title="Notifications" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Points Balance */}
        <section className="bg-white p-6 mx-4 mt-6 rounded-lg shadow-sm border border-emerald-100">
          <div className="text-center">
            <p className="text-gray-600">Your EcoPesa Balance</p>
            <p className="text-4xl font-bold text-emerald-600 my-2">1,250</p>
            <p className="text-gray-500 text-sm">≈ $12.50</p>
          </div>
        </section>

        {/* Rewards Catalog */}
        <section className="p-4 mt-6">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Redeem Rewards</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Reward Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 h-32 rounded-md mb-3 flex items-center justify-center">
                <span className="text-emerald-600">Gift Card Image</span>
              </div>
              <h3 className="font-bold">$5 Shopping Voucher</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-600 font-bold">500 pts</span>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs hover:bg-emerald-700">
                  Redeem
                </button>
              </div>
            </div>

            {/* Reward Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 h-32 rounded-md mb-3 flex items-center justify-center">
                <span className="text-emerald-600">Gift Card Image</span>
              </div>
              <h3 className="font-bold">Eco Water Bottle</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-600 font-bold">800 pts</span>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs hover:bg-emerald-700">
                  Redeem
                </button>
              </div>
            </div>

            {/* Reward Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 h-32 rounded-md mb-3 flex items-center justify-center">
                <span className="text-emerald-600">Gift Card Image</span>
              </div>
              <h3 className="font-bold">$10 Cash</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-600 font-bold">1,000 pts</span>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs hover:bg-emerald-700">
                  Redeem
                </button>
              </div>
            </div>

            {/* Reward Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 h-32 rounded-md mb-3 flex items-center justify-center">
                <span className="text-emerald-600">Gift Card Image</span>
              </div>
              <h3 className="font-bold">Eco Tote Bag</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-600 font-bold">1,200 pts</span>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs hover:bg-emerald-700">
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}