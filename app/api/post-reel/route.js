// app/api/post-reel/route.js
import axios from 'axios';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  const { userId, videoUrl, caption } = await req.json();

  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const { accessToken } = user;

    // Post Reel to Instagram using Instagram Graph API
    const response = await axios.post(
      `https://graph.facebook.com/v14.0/${user.instagramId}/media`,
      {
        media_type: 'VIDEO',
        video_url: videoUrl,
        caption,
        access_token: accessToken,
      }
    );

    if (response.data.id) {
      // Publish the reel
      await axios.post(
        `https://graph.facebook.com/v14.0/${user.instagramId}/media_publish`,
        {
          creation_id: response.data.id,
          access_token: accessToken,
        }
      );

      return new Response(JSON.stringify({ message: 'Reel posted successfully' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to post reel' }), { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
