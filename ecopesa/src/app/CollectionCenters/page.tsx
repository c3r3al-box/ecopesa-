import Head from 'next/head';
import CollectionMapWrapper from './CollectionMapWrapper';
import type { Center } from '@/types';

export default function CollectionCenters() {
  const centers: Center[] = [
    {
      id: '1',
      name: 'Nairobi Recycling Center',
      address: 'Mombasa Road, Nairobi',
      hours: '8AM - 6PM',
      capacity: 1000,
      current_load: 250,
      is_full: false,
      created_at: '2025-09-15T10:00:00Z',
      location: {
        type: 'Point',
        coordinates: [36.817923, -1.318243], // [lng, lat]
      },
    },
    {
      id: '2',
      name: 'Kibera Collection Point',
      address: 'Kibera Drive, Nairobi',
      hours: '7AM - 7PM',
      capacity: 800,
      current_load: 800,
      is_full: true,
      created_at: '2025-09-15T10:00:00Z',
      location: {
        type: 'Point',
        coordinates: [36.7813, -1.3136],
      },
    },
    {
      id: '3',
      name: 'Westlands Eco Hub',
      address: 'Waiyaki Way, Nairobi',
      hours: '9AM - 5PM',
      capacity: 1200,
      current_load: 600,
      is_full: false,
      created_at: '2025-09-15T10:00:00Z',
      location: {
        type: 'Point',
        coordinates: [36.8029, -1.2657],
      },
    },
    {
      id: '4',
      name: 'Thika Green Center',
      address: 'Thika Road, Kiambu',
      hours: '8AM - 5PM',
      capacity: 1500,
      current_load: 1500,
      is_full: true,
      created_at: '2025-09-15T10:00:00Z',
      location: {
        type: 'Point',
        coordinates: [37.0694, -1.0336],
      },
    },
  ];

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

        <main className="container mx-auto p-4">
          <div className="rounded-lg h-64 mb-6 overflow-hidden">
            <CollectionMapWrapper centers={centers} />
          </div>

          <h2 className="text-xl font-bold text-emerald-800 mb-4">Nearby Centers</h2>

          <div className="space-y-4">
            {centers.map(center => {
              const statusLabel = center.is_full ? 'Full' : 'Open';
              const distance = '—'; // placeholder until geolocation is added

              return (
                <div key={center.id} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{center.name}</h3>
                      <p className="text-gray-600 text-sm">{distance}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      center.is_full ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{center.address}</p>
                  <p className="text-gray-700">{center.hours}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Load: {center.current_load} / {center.capacity}
                  </p>
                  <button className="mt-3 text-emerald-600 font-medium text-sm flex items-center">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
