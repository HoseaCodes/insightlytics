'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <Card className="w-full max-w-md p-4 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Welcome, {session.user.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add form to post reels here */}
            <Button
              onClick={() => signOut()}
              className="w-full mt-4"
              variant="outline"
            >
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md p-4 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Sign in to Instagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn('instagram')}
            className="w-full mt-4"
            variant="primary"
          >
            📲 Sign in with Instagram
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
