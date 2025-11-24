'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import type { Center } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CollectionCenters() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchNearbyCenters = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          // Call Postgres function via Supabase RPC
          const { data, error } = await supabase.rpc('get_nearby_centres', {
            user_lat: latitude,
            user_lng: longitude,
            radius_km: 5, // search within 5km
          });

          if (error) {
            console.error('Error fetching nearby centres:', error.message);
            setError('Could not fetch nearby centres.');
          } else {
            setCenters(data as Center[]);
          }

          setLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err.message);
          setError('Unable to access your location.');
          setLoading(false);
        }
      );
    };

    fetchNearbyCenters();
  }, []);

  return (
    <>
      <Head>
        <title>EcoPesa - Nearby Collection Centres</title>
      </Head>

      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-800 text-white p-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                title="Back"
                aria-label="Back"
                onClick={() => router.push('/CollectionCenters')}
                className="p-2 rounded-full hover:bg-emerald-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Nearby Collection Centres</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="ml-3 text-gray-600">Finding centres near you...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 py-12">{error}</p>
          ) : centers.length === 0 ? (
            <p className="text-center text-gray-600 py-12">
              No centres found within 5km of your location.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {centers.map((center) => {
                const statusLabel = center.is_full ? 'Full' : 'Open';

                return (
                  <div
                    key={center.id}
                    className="bg-white px-6 py-5 rounded-lg shadow-sm border border-emerald-100 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-emerald-700">{center.name}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          center.is_full
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <p className="text-gray-700 mt-2">{center.address}</p>
                    {center.hours && (
                      <p className="text-gray-600 text-sm">{center.hours}</p>
                    )}

                    <div className="mt-2">
                      <p className="text-gray-600 text-sm">
                        Load: {center.current_load} / {center.capacity}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            center.is_full ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${(center.current_load / center.capacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      href={`/CollectionCenters/${center.id}`}
                      className="mt-4 inline-flex items-center text-emerald-600 font-semibold text-sm hover:underline transition"
                    >
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
