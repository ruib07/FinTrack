import { Router } from "express";
import asyncHandler from "express-async-handler";
import { BudgetsController } from "../controllers/budgets.controller.js";

export const budgetsRoutes = Router();

budgetsRoutes.get("/", asyncHandler(BudgetsController.getAll));
budgetsRoutes.get("/:id", asyncHandler(BudgetsController.getById));
budgetsRoutes.get(
  "/by-user/:userId",
  asyncHandler(BudgetsController.getByUserId)
);
budgetsRoutes.get(
  "/by-category/:categoryId",
  asyncHandler(BudgetsController.getByCategoryId)
);
budgetsRoutes.post("/", asyncHandler(BudgetsController.create));
budgetsRoutes.put("/:id", asyncHandler(BudgetsController.update));
budgetsRoutes.delete("/:id", asyncHandler(BudgetsController.delete));
