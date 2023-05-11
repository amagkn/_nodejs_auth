import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user-repository.js";

export async function registerUser(email, password) {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserRepository.insertOne({
    email: { address: email, verify: false },
    password: hashedPassword,
  });

  return user;
}

export async function authorizeUser(email, password) {
  const user = await UserRepository.findOne({ "email.address": email });

  if (!user) {
    throw new Error("User not found!");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new Error("Invalid email or password!");
  }

  return user;
}
