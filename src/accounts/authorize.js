import bcrypt from "bcryptjs";
import { User } from "../user/user.js";

export async function authorizeUser(email, password) {
  const user = await User.findOne({ "email.address": email });

  if (!user) {
    throw new Error("User not found!");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new Error("Invalid email or password!");
  }

  return user;
}
