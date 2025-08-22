import Head from 'next/head'
import dynamic from 'next/dynamic'



export default function CollectionCenters() {

     const centers = [
    {
      id: 1,
      name: "Nairobi Recycling Center",
      distance: "2.5km away",
      address: "Mombasa Road, Nairobi",
      hours: "Open: 8AM - 6PM",
      status: "Open",
      position: [-1.318243, 36.817923] as [number, number] // Coordinates for Mombasa Road
    },
    {
      id: 2,
      name: "Kibera Collection Point",
      distance: "5.1km away",
      address: "Kibera Drive, Nairobi",
      hours: "Open: 7AM - 7PM",
      status: "Open",
      position: [-1.3136, 36.7813] as [number, number] // Coordinates for Kibera
    },
    {
      id: 3,
      name: "Westlands Eco Hub",
      distance: "7.3km away",
      address: "Waiyaki Way, Nairobi",
      hours: "Open: 9AM - 5PM",
      status: "Open",
      position: [-1.2657, 36.8029] as [number, number] // Coordinates for Westlands
    },
    {
      id: 4,
      name: "Thika Green Center",
      distance: "30km away",
      address: "Thika Road, Kiambu",
      hours: "Open: 8AM - 5PM",
      status: "Open",
      position: [-1.0336, 37.0694] as [number, number] // Coordinates for Thika
    }
  ]


  return (
    <>
       <Head>
        <title>EcoPesa - Collection Centers</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </Head>

     
      <div className="min-h-screen bg-emerald-50">
        {        /* Header */}
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
          {/* Map Component */}
           <div className="rounded-lg h-64 mb-6 overflow-hidden">
            <Map centers={centers} />
          </div>

             {/* Nearby Centers */}
                   <h2 className="text-xl font-bold text-emerald-800 mb-4">Nearby Centers</h2>
          
          <div className="space-y-4">
            {centers.map(center => (
              <div key={center.id} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{center.name}</h3>
                    <p className="text-gray-600 text-sm">{center.distance}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">{center.status}</span>
                </div>
                <p className="text-gray-700 mt-2">{center.address}</p>
                <p className="text-gray-700">{center.hours}</p>
                <button className="mt-3 text-emerald-600 font-medium text-sm flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            ))}
          </div>
        </main>
      </div>
    </>
  )
}