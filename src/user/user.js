import { client } from "../db.js";

export const User = client.db("auth-service").collection("user");
