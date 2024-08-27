// models/Event.js
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  note: { type: String, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
