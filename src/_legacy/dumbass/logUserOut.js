import jwt from "jsonwebtoken";
import { SessionRepository } from "../repositories/session-repository.js";

export async function logUserOut(req, res) {
  try {
    if (req.cookies?.refreshToken) {
      const { refreshToken } = req.cookies;

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET
      );

      await SessionRepository.deleteOne({
        sessionToken: decodedRefreshToken.sessionToken,
      });
    }

    res.clearCookie("refreshToken").clearCookie("accessToken");
  } catch (e) {}
}
