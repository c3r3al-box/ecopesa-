import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { jobId, weight, location } = await req.json();

  const geoPoint = `SRID=4326;POINT(${location.lng} ${location.lat})`;

  const { error } = await supabase
    .rpc('verify_job', {
      p_job_id: jobId,
      p_weight: weight,
      p_geo_location: geoPoint
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
