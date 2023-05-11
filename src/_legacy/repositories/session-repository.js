import { client } from "../db.js";

export const SessionRepository = client
  .db("auth-service")
  .collection("session");
