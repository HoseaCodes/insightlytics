// app/api/strategy/route.js
import { OpenAI } from 'openai';
import connectToDatabase from '@/lib/mongodb';
import SocialMediaStrategy from '@/models/SocialMediaStrategy';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

function formatStrategyData(type, month, text) {
  const lines = text.split('\n');
  const days = [];
  
  lines.forEach((line, index) => {
    if (line.startsWith('Day')) {
      const day = parseInt(line.match(/\d+/)[0], 10); // Extract day number
      const contentIndex = index + 1;
      if (contentIndex < lines.length) {
        const content = lines[contentIndex].trim();
        days.push({ day, post: content, completed: false }); // Initialize completed as false
      }
    }
  });
  
  return {
    type,
    month,
    days,
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const strategies = await SocialMediaStrategy.find();
    return new Response(JSON.stringify(strategies), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: `Failed to get strategies: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(req) {
  await connectToDatabase();
  const { id, day, completed } = await req.json();
    console.log('id:', id);
    console.log('day:', day);
    console.log('completed:', completed);
  // Update the specific day's completion status
  const strategy = await SocialMediaStrategy.findById(id);
  if (!strategy) {
    return new Response(JSON.stringify({ error: 'Strategy not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const dayToUpdate = strategy.days.find(d => d.day === day);
  if (dayToUpdate) {
    dayToUpdate.completed = completed;
    await strategy.save();
  }

  return new Response(JSON.stringify({ message: 'Social Media Strategy updated' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  const { type, month } = await req.json();

  if (!type) {
    return new Response(JSON.stringify({ error: 'Type is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (!month) {
    return new Response(JSON.stringify({ error: 'Month is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Ensure the database connection is established
    await connectToDatabase();
    let strategy;
    // Check if a strategy for the given type and month already exists
    const existingStrategy = await SocialMediaStrategy.findOne({ type, month }).maxTimeMS(30000);
    if (existingStrategy) {
      return new Response(JSON.stringify(existingStrategy), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate strategy using OpenAI
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Create a free organic ${type} strategy with 30 days of posts for a web design/developer agency for a single member LLC.`,
      max_tokens: 1500,
    });

    console.log('OpenAI response:', response.choices[0].text);
    console.log('Usage:', response.usage);

    if (!existingStrategy) {
      // Format and save the new strategy
      const strategyData = formatStrategyData(type, month, response.choices[0].text);
      const newStrategy = new SocialMediaStrategy(strategyData);
      await newStrategy.save();
      strategy = newStrategy;
    }

    return new Response(JSON.stringify(strategy), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: `Failed to generate strategy: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
