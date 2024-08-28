import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ message: 'Address is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch geocode data');
    }

    const data = await response.json();

    if (data.results.length === 0) {
      return NextResponse.json({ message: 'No results found for the specified location' }, { status: 404 });
    }

    const { lat, lng } = data.results[0].geometry.location;
    return NextResponse.json({ lat, lng }, { status: 200 });
  } catch (error) {
    console.error('Error converting address to coordinates:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
