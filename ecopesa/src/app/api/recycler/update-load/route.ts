import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { centreId, loadDelta } = body;

  if (!centreId || typeof loadDelta !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  // Fetch current load
  const { data: centre, error: fetchError } = await supabase
    .from('collection_centres')
    .select('current_load')
    .eq('id', centreId)
    .maybeSingle();

  if (fetchError || !centre) {
    return NextResponse.json({ error: 'Centre not found' }, { status: 404 });
  }

  const newLoad = centre.current_load + loadDelta;

  const { error: updateError } = await supabase
    .from('collection_centres')
    .update({ current_load: newLoad })
    .eq('id', centreId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, newLoad });
}
