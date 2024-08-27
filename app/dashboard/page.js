// app/components/Dashboard.js
'use client';

import { useState } from 'react';

export default function Dashboard({ userId }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/post-reel', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          videoUrl,
          caption,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Reel posted successfully!');
      } else {
        alert('Failed to post reel.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to post reel.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button type="submit">Post Reel</button>
    </form>
  );
}
