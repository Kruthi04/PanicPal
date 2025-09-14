import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Attempting MongoDB connection...', {
      uri: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
      nodeEnv: process.env.NODE_ENV
    });
    
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      mongodbUri: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
      nodeEnv: process.env.NODE_ENV,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    if (process.env.NODE_ENV === 'production') {
      // In production, retry connection after delay
      setTimeout(() => {
        console.log('Retrying MongoDB connection...');
        connectDB();
      }, 5000);
    } else {
      // In development, exit process
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDB;