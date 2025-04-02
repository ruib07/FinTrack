import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { Budget } from "../models/budget.model.js";
import { BudgetRepository } from "../repositories/budget.repository.js";

export class BudgetService {
  private budgetRepository = new BudgetRepository();

  async getAll(): Promise<Budget[]> {
    return this.budgetRepository.getAll();
  }

  async getById(id: string): Promise<Budget> {
    const budget = await this.budgetRepository.getById(id);

    if (!budget) throw new NotFoundError("Budget not found.");

    return budget;
  }

  async getByUserId(userId: string): Promise<Budget[]> {
    return this.budgetRepository.getByUserId(userId);
  }

  async getByCategoryId(categoryId: string): Promise<Budget[]> {
    return this.budgetRepository.getByCategoryId(categoryId);
  }

  async save(budget: Budget): Promise<Budget> {
    if (!budget.limit_amount)
      throw new ValidationError("Limit amount is required.");
    if (!budget.start_date)
      throw new ValidationError("Start date is required.");
    if (!budget.end_date) throw new ValidationError("End date is required.");

    return await this.budgetRepository.save(budget);
  }

  async update(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    const budget = await this.budgetRepository.getById(id);

    if (!budget) throw new NotFoundError("Budget not found.");

    return this.budgetRepository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    const budget = await this.budgetRepository.getById(id);

    if (!budget) throw new NotFoundError("Budget not found.");

    await this.budgetRepository.delete(id);
  }
}
