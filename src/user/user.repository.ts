import { dbClient } from "src/core/db";

export const UserRepository = dbClient.db("auth-service").collection("users");
