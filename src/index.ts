import "src/env";

import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { authController } from "src/auth/auth.controller";
import { connectToDB } from "src/core/db";
import { personalAreaController } from "src/personal-area/personal-area.controller";

const app = Fastify();

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

authController(app);
personalAreaController(app);

app.setErrorHandler(function (error, req, res) {
  res
    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: error.message });
});

async function startApp() {
  try {
    await app.listen({ port: 3000 });

    console.log("Server is running on 3000");
  } catch (e) {
    console.error(e);
  }
}
connectToDB().then(startApp);
