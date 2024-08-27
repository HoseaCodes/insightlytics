'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export default function StrategyPage() {
  const router = useRouter();
  const [strategyType, setStrategyType] = useState('Instagram');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Perform any necessary client-side updates or side effects here.
  }, []);

  const generateStrategy = async () => {
    setLoading(true);
    setError(null);

    try {
      const date = new Date();
      const currentMonth = date.toLocaleString('default', { month: 'long' });
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: strategyType, month: currentMonth }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status} ${res.statusText}`);
      }

      router.push(`/dashboard/calendar`);
    } catch (err) {
      console.error(err);
      setError(`Failed to generate strategy. Please try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 md:space-y-6 lg:space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Strategy</h2>
      
      <Select
        value={strategyType}
        onValueChange={(value) => setStrategyType(value)}
        className="w-full max-w-xs"
      >
        <SelectTrigger>
          <button className="w-full h-10 px-4 border rounded-md bg-white text-gray-900">
            {strategyType}
          </button>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Instagram">Instagram</SelectItem>
          <SelectItem value="Facebook">Facebook</SelectItem>
          <SelectItem value="Twitter">Twitter</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        onClick={generateStrategy}
        disabled={loading}
        className="w-full max-w-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Strategy'}
      </Button>
      
      {error && (
        <Alert
          variant="error"
          className="w-full max-w-xs"
        >
          {error}
        </Alert>
      )}
    </div>
  );
}
