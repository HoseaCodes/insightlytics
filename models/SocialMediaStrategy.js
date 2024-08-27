const mongoose = require('mongoose');

// Define the schema for the social media strategy
const SocialMediaStrategySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'],
  },
  month: {
    type: String,
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
  },
  days: [
    {
      day: {
        type: Number,
        required: true,
      },
      post: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      }
    }
  ],
  completed: {
    type: Boolean,
    default: false,
  }
});

const SocialMediaStrategy = mongoose.models.SocialMediaStrategy || mongoose.model('SocialMediaStrategy', SocialMediaStrategySchema);

export default SocialMediaStrategy;
