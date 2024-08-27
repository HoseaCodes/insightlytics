// app/api/events/route.js
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET() {
  await connectToDatabase();
  const events = await Event.find();
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  await connectToDatabase();
  const { note, date } = await req.json();
  const newEvent = new Event({ note, date, completed: false });
  await newEvent.save();
  return new Response(JSON.stringify(newEvent), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PATCH(req) {
  await connectToDatabase();
  const { id, completed } = await req.json();
  await Event.findByIdAndUpdate(id, { completed });
  return new Response(JSON.stringify({ message: 'Event updated' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
