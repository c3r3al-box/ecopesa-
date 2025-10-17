export async function geocodeLocation(place: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}&limit=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('OpenCage response:', data); // ✅ log it

    if (!data.results?.length) return null;

    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
}
