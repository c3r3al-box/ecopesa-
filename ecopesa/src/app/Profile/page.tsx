// app/profile/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'



export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login') // or your login route
  }

  const fullName = user.user_metadata?.full_name || 'Your Name'
  const email = user.email || 'No email'
  const joinDate = new Date(user.created_at).toLocaleDateString()

  const metadata = {
    title: 'My Profile - EcoPesa',
    description: 'View and manage your EcoPesa profile and recycling stats',
  }

  return (
    <>
      <div className="min-h-screen bg-emerald-50">
        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">My Profile</h1>
            <button className="p-2 rounded-full bg-emerald-700" title="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c..." />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0..." />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-emerald-800">{fullName}</h2>
            <p className="text-gray-600">{email}</p>

            <div className="mt-4 bg-emerald-100 rounded-full py-2 px-4 inline-block">
              <span className="text-emerald-800 font-medium">Member since {joinDate}</span>
            </div>
          </div>
        </section>

        {/* Stats - Keep static or connect to Supabase DB if available */}
        <section className="px-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-4">My Recycling Stats</h3>
            {/* Stats UI remains unchanged for now */}
            ...
          </div>
        </section>

        {/* Menu */}
        <section className="p-6 mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden">
            {/* Menu buttons here */}
            ...
          </div>
        </section>
      </div>
    </>
  )
}
