import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { geocodeLocation } from '@/lib/geocode';

async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('collection_centres')
    .select('id, name, location, capacity, address, hours');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ centres: data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const body = await req.json();
  const { name, LocationText, capacity, address, hours } = body;

  const coords = await geocodeLocation(LocationText);
  if (!coords) {
    return NextResponse.json({ error: 'Failed to geocode location' }, { status: 400 });
  }

  const location = `SRID=4326;POINT(${coords.lng} ${coords.lat})`;

  const { data, error } = await supabase
    .from('collection_centres')
    .insert([{ name, location, capacity, address, hours }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Insert successful', data }, { status: 201 });
}
