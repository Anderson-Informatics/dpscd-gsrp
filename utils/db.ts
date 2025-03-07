import mongoose from "mongoose";

declare global {
  var cachedConnection: typeof mongoose | null;
}

let cachedConnection = globalThis.cachedConnection;
if (!cachedConnection) {
  cachedConnection = global.cachedConnection = null;
}

const uri = useRuntimeConfig().MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

export async function ConnectDB() {
  if (cachedConnection) {
    //console.log("Used cached connection")
    return cachedConnection;
  }

  const connect = async () => {
    //console.log("Connecting to database");

    return mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  };

  let attempt = 0;
  const maxAttempts = 2;

  while (attempt < maxAttempts) {
    try {
      cachedConnection = await connect();
      global.cachedConnection = cachedConnection;
      console.log("Database connection successful");
      return cachedConnection;
    } catch (error) {
      attempt += 1;
      console.error(`Database connection attempt ${attempt} failed:`, error);

      if (attempt >= maxAttempts) {
        console.error("All database connection attempts failed");
        throw error;
      } else {
        console.log("Retrying database connection...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
}
