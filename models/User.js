// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    instagramId: String,
    accessToken: String,
    refreshToken: String,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
