import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please check the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
  cachedConnection = global.mongooseConnection = {
    connection: null,
    promise: null,
  };
}

async function connectToDatabase() {
  if (cachedConnection.connection) {
    return cachedConnection.connection;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        return mongoose.connection;
      })
      .catch((error) => {
        console.error("Error connecting to database:", error);
        throw new Error("Failed to connect to MongoDB");
      });
  }

  cachedConnection.connection = await cachedConnection.promise;
  return cachedConnection.connection;
}

export default connectToDatabase;
