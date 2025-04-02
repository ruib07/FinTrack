import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { Transaction } from "../models/transaction.model.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";

export class TransactionService {
  private transactionRepository = new TransactionRepository();

  async getAll(): Promise<Transaction[]> {
    return this.transactionRepository.getAll();
  }

  async getById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.getById(id);

    if (!transaction) throw new NotFoundError("Transaction not found.");

    return transaction;
  }

  async getByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.getByUserId(userId);
  }

  async getByCategoryId(categoryId: string): Promise<Transaction[]> {
    return this.transactionRepository.getByCategoryId(categoryId);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    if (!transaction.amount) throw new ValidationError("Amount is required.");
    if (!transaction.type) throw new ValidationError("Type is required.");
    if (!transaction.payment_method)
      throw new ValidationError("Payment method is required.");
    if (!transaction.date) throw new ValidationError("Date is required.");

    return await this.transactionRepository.save(transaction);
  }
}
