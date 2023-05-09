import mongo from "mongodb";

const { MongoClient } = mongo;

const url = process.env.MONGO_URL;

export const client = new MongoClient(url);

export async function connectDB() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);

    await client.close();
  }
}
