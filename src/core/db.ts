import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL as string;

export const dbClient = new MongoClient(url);

export const connectToDB = async () => {
  try {
    await dbClient.connect();

    await dbClient.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
};
