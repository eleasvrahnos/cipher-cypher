import mongoose from 'mongoose';
import User from '@/models/User';
import validator from 'validator';
import { NextResponse } from 'next/server';

require('dotenv').config();

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(request) {
  const { username, email, password } = await request.json();

  await connectToDatabase();

  try {
    if (!username || !email || !password) {
      return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
    }
    if (!validator.isEmail(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ message: "Username or Email already exists" }, { status: 400 });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
