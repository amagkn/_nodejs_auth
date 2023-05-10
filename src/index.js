import "./env.js";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.post("/api/register", {}, async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await registerUser(email, password);

        res.send(user);
      } catch (e) {
        console.error(e);

        res.send(e.message);
      }
    });

    app.post("/api/authorize", {}, async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await authorizeUser(email, password);

        res.send(user);
      } catch (e) {
        console.error(e);

        res.send(e.message);
      }
    });

    await app.listen({ port: 3000 });

    console.log("Server is running on 3000");
  } catch (e) {
    console.log(e);
  }
}
connectDB().then(() => {
  startApp();
});
