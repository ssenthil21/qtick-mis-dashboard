import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') ?? '5000';

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GOOGLE_PLACES_API_KEY' }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=beauty_salon&key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Failed to fetch Google Places data', details: text }, { status: res.status });
    }
    const data = await res.json();
    const results = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.vicinity,
    }));
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Unexpected error fetching Google Places data', error);
    return NextResponse.json(
      { error: 'Unexpected error fetching Google Places data' },
      { status: 500 }
    );
  }
}
