import { createSession } from "../services/session-service.js";

export async function logUserIn(userId, req, res) {
  const connectionInformation = {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };

  const sessionToken = await createSession(userId, connectionInformation);

  console.log("sessionToken", sessionToken);
}
