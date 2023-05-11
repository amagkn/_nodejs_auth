import { FastifyReply } from "fastify";

class CookiesService {
  setTokens(res: FastifyReply, refreshToken: string, accessToken: string) {
    const now = new Date();
    const refreshExpires = new Date(now.setDate(now.getDate() + 30));

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

  clearTokens(res: FastifyReply) {
    res.clearCookie("refreshToken").clearCookie("accessToken");
  }
}

export const cookiesService = new CookiesService();
