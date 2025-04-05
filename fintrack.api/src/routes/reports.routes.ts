import { Router } from "express";
import asyncHandler from "express-async-handler";
import { ReportsController } from "../controllers/reports.controller.js";

export const reportsRoutes = Router();

reportsRoutes.get("/", asyncHandler(ReportsController.getAll));
reportsRoutes.get("/:id", asyncHandler(ReportsController.getById));
reportsRoutes.get(
  "/by-user/:userId",
  asyncHandler(ReportsController.getByUserId),
);
reportsRoutes.post("/", asyncHandler(ReportsController.create));
reportsRoutes.put("/:id", asyncHandler(ReportsController.update));
reportsRoutes.delete("/:id", asyncHandler(ReportsController.delete));
