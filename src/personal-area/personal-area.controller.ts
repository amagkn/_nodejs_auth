import { FastifyInstance } from "fastify";
import { currentUserInterceptor } from "src/auth/interceptors/current-user.interceptor";

export const personalAreaController = (app: FastifyInstance) => {
  app.get("/private/balance", async (req, res) => {
    const user = await currentUserInterceptor(req, res);

    res.send({ user, balance: "ochen' mnogo deneg" });
  });
};
