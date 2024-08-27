"use client";

import { Dialog, DialogTitle, DialogDescription } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import win from 'global';

export function Modal({ isOpen, onClose, event, onUpdateEvent }) {
  const [isComplete, setIsComplete] = useState(event?.completed || false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event) {
      setIsComplete(event.completed);
    }
  }, [event]);

  const handleCheckboxChange = () => {
    setIsComplete(!isComplete);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/strategy', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: event.id,
          completed: isComplete,
          day: event.start.getDate(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status} ${res.statusText}`);
      }

      // Call the onUpdateEvent callback to update the state in the parent component
      onUpdateEvent({ ...event, completed: isComplete });

      // Close the modal
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(`Failed to update event: ${err.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md p-4 mx-4 bg-white rounded-lg shadow-lg">
        <DialogTitle className="text-xl font-semibold mb-2">Event Details</DialogTitle>
        <DialogDescription className="space-y-4">
          <div className="text-lg font-medium">{event?.title}</div>
          <p>{event?.start.toLocaleString()}</p>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="complete"
              checked={isComplete}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="complete" className="text-gray-700">Mark as Complete</label>
          </div>
          {error && (
            <p className="mt-4 text-red-500">{error}</p>
          )}
        </DialogDescription>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={onClose} variant="outline" className="bg-gray-200 hover:bg-gray-300">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">Save</Button>
        </div>
      </div>
    </Dialog>
  );
}
