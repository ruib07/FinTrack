import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service.js";
import { Transaction } from "../models/transaction.model.js";

export class TransactionsController {
  static async getAll(req: Request, res: Response) {
    res.send(await new TransactionService().getAll());
  }

  static async getById(req: Request, res: Response) {
    const transactionId = req.params.id;

    res.send(await new TransactionService().getById(transactionId));
  }

  static async getByUserId(req: Request, res: Response) {
    const userId = req.params.userId;

    res.send(await new TransactionService().getByUserId(userId));
  }

  static async getByCategoryId(req: Request, res: Response) {
    const categoryId = req.params.categoryId;

    res.send(await new TransactionService().getByCategoryId(categoryId));
  }

  static async create(req: Request, res: Response) {
    const transaction = req.body as Transaction;

    const createdTransaction = await new TransactionService().save(transaction);

    res.status(201).send({
      message: "Transaction created successfully.",
      id: createdTransaction.id,
    });
  }
}
