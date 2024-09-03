import mongoose from 'mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

require('dotenv').config();

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(request) {
  const { token } = await request.json();

  await connectToDatabase();

  try {
    if (!token) {
      return NextResponse.json({ auth: false, data: "No Token Found in request" }, { status: 400 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return NextResponse.json({ auth: false, data: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ auth: true, data: { username: user.username } });
    } catch (error) {
      return NextResponse.json({ auth: false, data: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
