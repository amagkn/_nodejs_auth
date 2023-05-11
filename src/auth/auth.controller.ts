import { FastifyInstance } from "fastify";
import { authService } from "src/auth/auth.service";
import { cookiesService } from "src/auth/cookies.service";
import { SessionRepository } from "src/auth/session/session.repository";
import { sessionService } from "src/auth/session/session.service";

export const authController = (app: FastifyInstance) => {
  app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await authService.register(email, password);

    res.send(user);
  });

  app.post("/auth/authorize", async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await authService.authorize(email, password);

    const sessionToken = await sessionService.createSession(
      req.ip,
      req.headers["user-agent"] || "",
      user._id
    );

    const { refreshToken, accessToken } = await authService.generateTokens(
      sessionToken,
      user._id
    );

    cookiesService.setTokens(res, refreshToken, accessToken);

    res.send(user);
  });

  app.post("/auth/logout", async (req, res) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const decodedRefreshToken = authService.verifyRefreshToken(refreshToken);

      await SessionRepository.deleteOne({
        sessionToken: decodedRefreshToken.sessionToken,
      });
    }

    cookiesService.clearTokens(res);

    res.status(201);
  });
};
