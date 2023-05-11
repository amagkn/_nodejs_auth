import jwt from "jsonwebtoken";

export async function createTokens(sessionToken, userId) {
  try {
    const refreshToken = jwt.sign({ sessionToken }, process.env.JWT_SECRET);

    const accessToken = jwt.sign(
      { sessionToken, userId },
      process.env.JWT_SECRET
    );

    return { refreshToken, accessToken };
  } catch (e) {
    console.error(e);

    throw new Error("Session creation failed");
  }
}
