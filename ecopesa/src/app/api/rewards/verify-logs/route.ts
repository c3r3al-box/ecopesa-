import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { logId, recyclerId } = await req.json();

  // 1. Fetch the recycling log
  const { data: log, error: logError } = await supabase
    .from('recycling_logs')
    .select('id, user_id, center_id, staff_pin, recycled_weight')
    .eq('id', logId)
    .single();

  if (logError || !log) {
    return NextResponse.json({ error: logError?.message || 'Log not found' }, { status: 404 });
  }

  // 2. Mark the log as verified
  const { error: updateError } = await supabase
    .from('recycling_logs')
    .update({ verified: true, verified_by: recyclerId })
    .eq('id', logId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

 // 3. Update centre load with capacity check
const { data: centre, error: centreFetchError } = await supabase
  .from('collection_centres')
  .select('current_load, capacity, is_full')
  .eq('id', log.center_id)
  .single();

if (centreFetchError) {
  return NextResponse.json({ error: centreFetchError.message }, { status: 500 });
}

const projectedLoad = (centre?.current_load ?? 0) + log.recycled_weight;

// Guard clause: prevent exceeding capacity
if (projectedLoad > (centre?.capacity ?? Infinity)) {
  return NextResponse.json({
    error: 'Centre is at full capacity. Pickup job will be created automatically.',
    centreId: log.center_id,
    capacity: centre?.capacity,
    currentLoad: centre?.current_load,
  }, { status: 200 });
}

// Otherwise, update load normally
const { error: centreUpdateError } = await supabase
  .from('collection_centres')
  .update({ current_load: projectedLoad })
  .eq('id', log.center_id);

if (centreUpdateError) {
  return NextResponse.json({ error: centreUpdateError.message }, { status: 500 });
}



  // 4. Update recycling_stats (eco_points, pickups, weight, centres visited)
  const { data: recycling_stats, error: statsError } = await supabase
    .from('recycling_stats')
    .select('total_pickups, total_weight, eco_points, centers_visited')
    .eq('user_id', log.user_id)
    .maybeSingle();

  if (statsError) {
    return NextResponse.json({ error: statsError.message }, { status: 500 });
  }

  // Count distinct centres visited by this user (after marking current log verified)
  const { data: distinctCentres, error: centresError } = await supabase
    .from('recycling_logs')
    .select('center_id')
    .eq('user_id', log.user_id)
    .eq('verified', true);

  if (centresError) {
    return NextResponse.json({ error: centresError.message }, { status: 500 });
  }

  const uniqueCentreCount = new Set(distinctCentres.map(l => l.center_id)).size;

  const newStats = {
    user_id: log.user_id,
    total_pickups: (recycling_stats?.total_pickups ?? 0) + 1,
    total_weight: (recycling_stats?.total_weight ?? 0) + log.recycled_weight,
    eco_points: (recycling_stats?.eco_points ?? 0) + log.recycled_weight,
    centers_visited: uniqueCentreCount,
    updated_at: new Date().toISOString(),
  };

  const { error: statsUpdateError } = await supabase
    .from('recycling_stats')
    .upsert(newStats, { onConflict: 'user_id' });

  if (statsUpdateError) {
    return NextResponse.json({ error: statsUpdateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Log verified, centre load updated, user stats updated',
    newLoad: projectedLoad,
    newPoints: newStats.eco_points,
    centersVisited: newStats.centers_visited,
  }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const staffPin = searchParams.get('staffPin');

  if (!staffPin) {
    return NextResponse.json({ error: 'Missing staffPin' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('recycling_logs')
    .select('id, user_id, recycled_weight, staff_pin, material_type, created_at')
    .eq('staff_pin', staffPin)
    .eq('verified', false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data }, { status: 200 });
}
