import { client } from "../db.js";

export const UserRepository = client.db("auth-service").collection("user");
