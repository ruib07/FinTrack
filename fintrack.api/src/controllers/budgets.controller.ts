import { Request, Response } from "express";
import { Budget } from "../models/budget.model.js";
import { BudgetService } from "../services/budget.service.js";

export class BudgetsController {
  static async getAll(req: Request, res: Response) {
    res.send(await new BudgetService().getAll());
  }

  static async getById(req: Request, res: Response) {
    let budgetId = req.params.id;

    res.send(await new BudgetService().getById(budgetId));
  }

  static async getByUserId(req: Request, res: Response) {
    let userId = req.params.userId;

    res.send(await new BudgetService().getByUserId(userId));
  }

  static async getByCategoryId(req: Request, res: Response) {
    let categoryId = req.params.userId;

    res.send(await new BudgetService().getByCategoryId(categoryId));
  }

  static async create(req: Request, res: Response) {
    const budget = req.body as Budget;

    const createdBudget = await new BudgetService().save(budget);

    res.status(201).send({
      message: "Budget created successfully!",
      id: createdBudget.id,
    });
  }

  static async update(req: Request, res: Response) {
    let budgetId = req.params.id;
    let budget = req.body as Budget;

    await new BudgetService().update(budgetId, budget);

    res.send({
      message: "Budget updated successfully.",
    });
  }

  static async delete(req: Request, res: Response) {
    let budgetId = req.params.id;

    await new BudgetService().delete(budgetId);
    res.status(204).end();
  }
}
