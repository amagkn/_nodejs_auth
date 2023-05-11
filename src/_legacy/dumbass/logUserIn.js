import { createSession } from "../services/session-service.js";
import { createTokens } from "./tokens.js";

export async function logUserIn(userId, req, res) {
  const connectionInformation = {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };

  const sessionToken = await createSession(userId, connectionInformation);

  const { accessToken, refreshToken } = await createTokens(
    sessionToken,
    userId
  );

  const now = new Date();
  const refreshExpires = now.setDate(now.getDate() + 30);

  res
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      expires: refreshExpires,
    })
    .setCookie("accessToken", accessToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
    });
}
