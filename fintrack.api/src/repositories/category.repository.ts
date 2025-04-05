import db from "../config/db.js";
import { Category } from "../models/category.model.js";

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return db<Category>("categories").select("*");
  }

  async getById(id: string): Promise<Category | null> {
    const category = await db<Category>("categories").where({ id }).first();

    return category ?? null;
  }

  async getByUserId(userId: string): Promise<Category[]> {
    const categories = await db<Category>("categories")
      .where({ user_id: userId })
      .select("*");

    return categories;
  }

  async save(category: Omit<Category, "id">): Promise<Category> {
    const [newCategory] = await db<Category>("categories")
      .insert({ ...category })
      .returning("*");

    return newCategory;
  }

  async update(
    id: string,
    category: Partial<Category>,
  ): Promise<Category | null> {
    const [updatedCategory] = await db<Category>("categories")
      .where({ id })
      .update({ ...category })
      .returning("*");

    return updatedCategory;
  }

  async delete(id: string): Promise<number> {
    return db("categories").where({ id }).del();
  }
}
