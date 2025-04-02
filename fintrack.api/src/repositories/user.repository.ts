import db from "../config/db.js";
import { User } from "../models/user.model.js";

export class UserRepository {
  async getAll(): Promise<User[]> {
    return db<User>("users").select("*");
  }

  async getById(id: string): Promise<User | null> {
    const user = await db<User>("users").where({ id }).first();

    return user ?? null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await db<User>("users").where({ email: email }).first();

    return user ?? null;
  }

  async save(user: Omit<User, "id" | "created_at">): Promise<User> {
    const [newUser] = await db<User>("users")
      .insert({ ...user, created_at: new Date() })
      .returning("*");

    return newUser;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const [updatedUser] = await db<User>("users")
      .where({ id })
      .update({ ...user })
      .returning("*");

    return updatedUser;
  }

  async delete(id: string): Promise<number> {
    return db("users").where({ id }).del();
  }
}
