import "./env.js";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

console.log(process.env.MONGO_URL);

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.get("/", (req, res) => {
      res.send({ hello: "world" });
    });

    await app.listen({ port: 3000 });

    console.log("Server is running on 3000");
  } catch (e) {
    console.log(e);
  }
}

startApp();
