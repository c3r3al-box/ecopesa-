import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const [weightRes, userRes, recyclerRes, collectorRes, centreRes, pointsRes, verifiedRes] = await Promise.all([
    supabase.from('recycling_logs').select('recycled_weight'),
    supabase.from('profiles').select('id'),
    supabase.from('profiles').select('id').eq('role', 'recycler'),
    supabase.from('profiles').select('id').eq('role', 'collector'),
    supabase.from('collection_centres').select('id'),
    supabase.from('recycling_logs').select('points_earned'),
    supabase.from('recycling_logs').select('id').eq('verified', true),
  ]);
  console.log({ weightRes, userRes, recyclerRes, collectorRes, centreRes, pointsRes, verifiedRes });


  if (
    weightRes.error || userRes.error || recyclerRes.error || collectorRes.error ||
    centreRes.error || pointsRes.error || verifiedRes.error
  ) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }

  const totalWeight = (weightRes.data ?? []).reduce((sum, row) => sum + (row.recycled_weight || 0), 0);
  const totalPoints = (pointsRes.data ?? []).reduce((sum, row) => sum + (row.points_earned || 0), 0);
  

  return NextResponse.json({
    totalWeight,
    totalUsers: userRes.data?.length ?? 0,
    totalRecyclers: recyclerRes.data?.length ?? 0,
    totalCollectors: collectorRes.data?.length ?? 0,
    totalCentres: centreRes.data?.length ?? 0,
    totalPoints,
    verifiedLogs: verifiedRes.data?.length ?? 0,
  });
}
