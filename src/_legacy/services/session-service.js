import { randomBytes } from "crypto";
import { SessionRepository } from "../repositories/session-repository.js";

export async function createSession(userId, connection) {
  try {
    const sessionToken = randomBytes(43).toString("hex");

    const { ip, userAgent } = connection;

    await SessionRepository.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    return sessionToken;
  } catch (e) {
    console.error(e);
    throw new Error("Session creation failed");
  }
}
