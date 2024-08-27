import { NextResponse } from 'next/server';

export async function GET() {
  const { INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI } = process.env;

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;

  return NextResponse.redirect(authUrl);
}
