import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user-repository.js";
import { ObjectId } from "mongodb";
import { SessionRepository } from "../repositories/session-repository.js";
import { createTokens } from "./tokens.js";

export async function getUserFromCookies(req, res) {
  if (req.cookies?.accessToken) {
    const { accessToken } = req.cookies;

    const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await UserRepository.findOne({
      _id: new ObjectId(decodedAccessToken.userId),
    });

    return user;
  }

  if (req.cookies?.refreshToken) {
    const { refreshToken } = req.cookies;

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

    const currentSession = await SessionRepository.findOne({
      sessionToken: decodedRefreshToken.sessionToken,
    });

    if (currentSession.valid) {
      const user = await UserRepository.findOne({
        _id: new ObjectId(currentSession.userId),
      });

      await refreshTokens(
        currentSession.sessionToken,
        currentSession.userId,
        res
      );

      return user;
    }
  }
}

export async function refreshTokens(sessionToken, userId, res) {
  try {
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
  } catch (e) {
    console.error(e);
  }
}
