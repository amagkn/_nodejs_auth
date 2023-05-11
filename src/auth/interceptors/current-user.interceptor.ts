import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { authService } from "src/auth/auth.service";
import { cookiesService } from "src/auth/cookies.service";
import { SessionRepository } from "src/auth/session/session.repository";
import { ApiError } from "src/core/api-error";
import { UserRepository } from "src/user/user.repository";

export const currentUserInterceptor = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { accessToken, refreshToken } = req.cookies;

  if (accessToken) {
    const decodedAccessToken = authService.verifyAccessToken(accessToken);

    const user = await UserRepository.findOne({
      _id: new ObjectId(decodedAccessToken.userId),
    });

    return user;
  } else if (refreshToken) {
    const decodedRefreshToken = authService.verifyRefreshToken(refreshToken);

    const session = await SessionRepository.findOne({
      sessionToken: decodedRefreshToken.sessionToken,
    });

    if (session && session.valid) {
      const user = await UserRepository.findOne({
        _id: new ObjectId(session.userId),
      });

      if (user) {
        const { accessToken, refreshToken } = await authService.generateTokens(
          session.token,
          user?._id
        );

        cookiesService.setTokens(res, refreshToken, accessToken);

        return user;
      }
    }
  }

  throw new ApiError(StatusCodes.FORBIDDEN, "Session is invalid");
};
