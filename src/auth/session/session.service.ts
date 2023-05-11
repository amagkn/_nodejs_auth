import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { SessionRepository } from "src/auth/session/session.repository";

class SessionService {
  async createSession(ip: string, userAgent: string, userId: ObjectId) {
    const sessionToken = randomBytes(43).toString("hex");

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
  }
}

export const sessionService = new SessionService();
