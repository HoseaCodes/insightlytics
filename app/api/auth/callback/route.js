// pages/api/auth/callback.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  const { INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, INSTAGRAM_REDIRECT_URI } = process.env;
  
  try {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        code,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_message || `Error: ${response.status} ${response.statusText}`);
    }

    // Save the access token (e.g., in session or a database)
    // For simplicity, we will just return it here
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
