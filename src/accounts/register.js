import bcrypt from "bcryptjs";
import { User } from "../user/user.js";

export async function registerUser(email, password) {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await User.insertOne({
    email: { address: email, verify: false },
    password: hashedPassword,
  });

  return result.insertedId;
}
