
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/zenpos";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'development') {
  // Use globalThis instead of global to avoid "Cannot find name 'global'" errors in environments without Node.js global definitions.
  let globalWithMongo = globalThis as unknown as {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    // Omitting the options object as it was empty and causing strict type-checking issues with MongoClientOptions.
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Omitting the options object here as well for consistency and to resolve type-checking errors.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}
