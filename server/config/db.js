import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_CONNECTION_STRING) {
      throw new Error("MONGODB_CONNECTION_STRING is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
