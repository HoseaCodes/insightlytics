import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const location = url.searchParams.get('location') || '37.7749,-122.4194'; // Default to San Francisco
  const radius = url.searchParams.get('radius') || '5000'; // Default to 5 km
  const type = url.searchParams.get('type') || 'store';
  const keyword = url.searchParams.get('keyword') || 'new';
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Places API');
    }
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data.results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
