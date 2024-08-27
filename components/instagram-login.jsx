"use client";
import { Button } from '@/components/ui/button';

export default function InstagramLogin() {
  const handleLogin = () => {
    window.location.href = '/api/auth/authorize';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login with Instagram</h1>
      <Button onClick={handleLogin} className="bg-blue-600 text-white hover:bg-blue-700">
        Login with Instagram
      </Button>
    </div>
  );
}
