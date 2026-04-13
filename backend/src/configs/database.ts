import mongoose from 'mongoose';
import config from './constants';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
    } as mongoose.ConnectOptions);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
