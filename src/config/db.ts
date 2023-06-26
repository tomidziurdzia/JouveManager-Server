import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB connect on: ${url}`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
