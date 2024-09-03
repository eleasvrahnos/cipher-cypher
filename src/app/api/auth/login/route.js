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
  const { email, password } = await request.json();

  await connectToDatabase();

  try {
    if (!email || !password) {
      return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        mathmaniaSolved: user.mathmaniaSolved,
        puzzleparadiseSolved: user.puzzleparadiseSolved,
        riddlingrewindSolved: user.riddlingrewindSolved,
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
