import { compare, genSalt, hash } from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { AccessTokenPayload } from "src/auth/types/access-token-payload";
import { RefreshTokenPayload } from "src/auth/types/refresh-token-payload";
import { ApiError } from "src/core/api-error";
import { UserRepository } from "src/user/user.repository";

class AuthService {
  async register(email: string, password: string) {
    const emailInUse = await UserRepository.findOne({ email });

    if (emailInUse) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email is in use!");
    }

    const salt = await genSalt(10);

    const hashedPassword = await hash(password, salt);

    const user = await UserRepository.insertOne(
      {
        email,
        password: hashedPassword,
      },
      {}
    );

    return user;
  }

  async authorize(email: string, password: string) {
    const user = await UserRepository.findOne({ email });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Invalid email or password!");
    }

    return user;
  }

  async generateTokens(sessionToken: string, userId: ObjectId) {
    const refreshToken = jwt.sign({ sessionToken }, process.env.JWT_SECRET!);

    const accessToken = jwt.sign(
      { sessionToken, userId },
      process.env.JWT_SECRET!
    );

    return { refreshToken, accessToken };
  }

  verifyAccessToken(accessToken: string): AccessTokenPayload {
    return jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as AccessTokenPayload;
  }

  verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
    return jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    ) as RefreshTokenPayload;
  }
}

export const authService = new AuthService();
