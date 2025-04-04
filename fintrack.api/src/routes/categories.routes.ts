import { Router } from "express";
import asyncHandler from "express-async-handler";
import { CategoriesController } from "../controllers/categories.controller.js";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", asyncHandler(CategoriesController.getAll));
categoriesRoutes.get("/:id", asyncHandler(CategoriesController.getById));
categoriesRoutes.get(
  "/by-user/:userId",
  asyncHandler(CategoriesController.getByUserId)
);
categoriesRoutes.post("/", asyncHandler(CategoriesController.create));
categoriesRoutes.put("/:id", asyncHandler(CategoriesController.update));
categoriesRoutes.delete("/:id", asyncHandler(CategoriesController.delete));
