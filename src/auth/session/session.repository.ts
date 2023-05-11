import { dbClient } from "src/core/db";

export const SessionRepository = dbClient
  .db("auth-service")
  .collection("sessions");
