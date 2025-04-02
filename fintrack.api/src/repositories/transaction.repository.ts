import db from "../config/db.js";
import { Transaction } from "../models/transaction.model.js";

export class TransactionRepository {
  async getAll(): Promise<Transaction[]> {
    return db<Transaction>("transactions").select("*");
  }

  async getById(id: string): Promise<Transaction | null> {
    const transaction = await db<Transaction>("transactions")
      .where({ id })
      .first();

    return transaction ?? null;
  }

  async getByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await db<Transaction>("transactions")
      .where({ user_id: userId })
      .select("*");

    return transactions;
  }

  async getByCategoryId(categoryId: string): Promise<Transaction[]> {
    const transactions = await db<Transaction>("transactions")
      .where({ category_id: categoryId })
      .select("*");

    return transactions;
  }

  async save(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const [newTransaction] = await db<Transaction>("transactions")
      .insert({ ...transaction })
      .returning("*");

    return newTransaction;
  }
}
