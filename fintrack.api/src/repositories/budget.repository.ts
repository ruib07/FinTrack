import db from "../config/db.js";
import { Budget } from "../models/budget.model.js";

export class BudgetRepository {
  async getAll(): Promise<Budget[]> {
    return db<Budget>("budgets").select("*");
  }

  async getById(id: string): Promise<Budget | null> {
    const budget = await db<Budget>("budgets").where({ id }).first();

    return budget ?? null;
  }

  async getByUserId(userId: string): Promise<Budget[]> {
    const budgets = await db<Budget>("budgets")
      .where({ user_id: userId })
      .select("*");

    return budgets;
  }

  async getByCategoryId(categoryId: string): Promise<Budget[]> {
    const budgets = await db<Budget>("budgets")
      .where({ category_id: categoryId })
      .select("*");

    return budgets;
  }

  async save(budget: Omit<Budget, "id">): Promise<Budget> {
    const [newBudget] = await db<Budget>("budgets")
      .insert({ ...budget })
      .returning("*");

    return newBudget;
  }

  async update(id: string, budget: Partial<Budget>): Promise<Budget | null> {
    const [updatedBudget] = await db<Budget>("budgets")
      .where({ id })
      .update({ ...budget })
      .returning("*");

    return updatedBudget;
  }

  async delete(id: string): Promise<number> {
    return db("budgets").where({ id }).del();
  }
}
