import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // 1. Get the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 2. Get the request body
    const body = await req.json()

    // 3. Insert into users table
    const { error } = await supabase
      .from('profile')
      .insert([{
        id: user.id,
        full_name: body.full_name,
        email: user.email, // Use email from user
        phone_number: body.phone_number,
        joined_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Profile created successfully' },
      { status: 201 }
    )

  } catch (err: any) {
    console.error('Server error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}