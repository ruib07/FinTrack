import { Router } from "express";
import asyncHandler from "express-async-handler";
import { TransactionsController } from "../controllers/transactions.controller.js";

export const transactionsRoutes = Router();

transactionsRoutes.get("/", asyncHandler(TransactionsController.getAll));
transactionsRoutes.get("/:id", asyncHandler(TransactionsController.getById));
transactionsRoutes.get(
  "/by-user/:userId",
  asyncHandler(TransactionsController.getByUserId)
);
transactionsRoutes.get(
  "/by-category/:categoryId",
  asyncHandler(TransactionsController.getByCategoryId)
);
transactionsRoutes.post("/", asyncHandler(TransactionsController.create));
