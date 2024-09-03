import mongoose from 'mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(request) {
  const { email } = await request.json();

  await connectToDatabase();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const isDev = process.env.NODE_ENV === 'development';
    const resetLink = `${isDev ? "localhost:3000" : process.env.FRONTEND_URL}/password/resetForm?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. If this was not you, ignore this message. Otherwise, click the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. If this was not you, ignore this message. Otherwise, click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
