import mongo from "mongodb";

const url = process.env.MONGO_URL;

export const client = new mongo.MongoClient(url);

export async function connectDB() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);

    client.close();
  }
}
