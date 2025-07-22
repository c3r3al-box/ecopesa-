'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase/client'




export default function Home() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)


const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);



const handleStartRecycling = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    router.push('/profile'); // Redirect to profile if user is logged in
  } else {
    router.push('/auth/login'); // Redirect to login if not
  }
};

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
           <div className="flex flex-col items-end space-y-1">
            <Link
              href="/signup"
              className="bg-white text-emerald-600 px-4 py-1 rounded-full font-semibold shadow hover:bg-gray-100 transition"
            >
              Sign Up
            </Link>
            <p className="text-sm text-white">
              Already have an account?{' '}
             <Link href="/login" className="underline hover:text-emerald-200">
                Log In
            </Link>
            </p>
           </div>

          </div>
        </header>

        {/* Hero Section */}
        <section className="py-8 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Recycle & Earn Rewards</h2>
            <p className="mb-6">Turn your waste into EcoPesa points and redeem exciting rewards</p>
            <button
               onClick={handleStartRecycling}
               className="bg-white text-emerald-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition"
              >             
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
            <Link
              href="/CollectionCenters"
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-emerald-700 transition inline-block"
            >
              find a collection center
            </Link>
          </div>
        </section>

       
        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-xl w-11/12 max-w-sm text-center">
      <h2 className="text-xl font-bold mb-4 text-emerald-800">You're not logged in</h2>
      <p className="mb-6 text-gray-600">To start recycling, please log in or create an account.</p>
      <div className="flex justify-center space-x-4">
        <Link
          href="/login"
          className="bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-700 transition"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="bg-gray-200 text-emerald-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
        >
          Sign Up
        </Link>
      </div>
      <button
        onClick={() => setShowModal(false)}
        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      </div>
    </>
  )
}