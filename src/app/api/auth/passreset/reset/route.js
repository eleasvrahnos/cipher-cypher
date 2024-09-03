import mongoose from 'mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

require('dotenv').config();

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(request) {
  const { token, password } = await request.json();

  await connectToDatabase();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return NextResponse.json({ message: "New password cannot be the same as the old password." }, { status: 400 });
    }

    user.password = password;
    await user.save();

    return NextResponse.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
