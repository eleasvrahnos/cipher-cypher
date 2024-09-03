import mongoose, { Document, Model, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define an interface representing a user document in MongoDB.
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  mathmaniaSolved: number[];
  puzzleparadiseSolved: number[];
  riddlingrewindSolved: number[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  mathmaniaSolved: {
    type: [Number],
    default: [],
  },
  puzzleparadiseSolved: {
    type: [Number],
    default: [],
  },
  riddlingrewindSolved: {
    type: [Number],
    default: [],
  },
});

// Add indexes to optimize queries
userSchema.index({ mathmaniaSolved: -1 });
userSchema.index({ puzzleparadiseSolved: -1 });
userSchema.index({ riddlingrewindSolved: -1 });

// Mongoose middleware that runs before a document is saved to the database, in case the password was modified
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as CallbackError); // Type casting the error as CallbackError
  }
});

// Custom compare password method, to validate for login
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Create the model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
