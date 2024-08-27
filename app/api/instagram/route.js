// pages/api/post-instagram.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { caption, videoUrl } = await req.json();
    console.log(caption, videoUrl);

    // Instagram API endpoint for media upload (this is a placeholder)
    const uploadUrl = `https://graph.instagram.com/me/media?access_token=${process.env.IG_ACCESS_TOKEN}`;
    // First, upload the media
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url: videoUrl,
        caption: caption,
        media_type: 'REELS',
        // Additional parameters may be needed
      }),
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploadData.error.message + ' ' + uploadData.error.error_user_msg || `Error: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    // After uploading, publish the media
    const publishUrl = `https://graph.instagram.com/${uploadData.id}/media_publish?access_token=${process.env.IG_ACCESS_TOKEN}`;
    
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
    });

    const publishData = await publishResponse.json();

    if (!publishResponse.ok) {
      throw new Error(publishData.error.message || `Error: ${publishResponse.status} ${publishResponse.statusText}`);
    }

    return new NextResponse(JSON.stringify({ message: 'Post published successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to post' }), { status: 500 });
  }
}
