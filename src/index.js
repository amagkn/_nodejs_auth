import "./env.js";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { registerUser } from "./accounts/register.js";

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

        const userId = await registerUser(email, password);

        console.log(userId);
      } catch (e) {
        console.error(e);
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
