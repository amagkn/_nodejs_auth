import "../env.js";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { authorizeUser, registerUser } from "./services/auth-service.js";
import { logUserIn } from "./dumbass/logUserIn.js";
import { getUserFromCookies } from "./dumbass/user.js";
import { logUserOut } from "./dumbass/logUserOut.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    });

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

        await logUserIn(user._id, req, res);

        res.send(user);
      } catch (e) {
        console.error(e);

        res.send(e.message);
      }
    });

    app.get("/private", {}, async (req, res) => {
      try {
        const user = await getUserFromCookies(req, res);

        if (!user) {
          return res.status(403).send();
        }

        res.send(user);
      } catch (e) {
        console.error(e);
      }
    });

    app.post("/api/logout", {}, async (req, res) => {
      try {
        await logUserOut(req, res);

        res.send();
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
