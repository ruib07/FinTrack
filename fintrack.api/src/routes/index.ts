import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authenticationsRoutes } from "./authentications.routes.js";
import { budgetsRoutes } from "./budgets.routes.js";
import { categoriesRoutes } from "./categories.routes.js";
import { reportsRoutes } from "./reports.routes.js";
import { resetPasswordsRoutes } from "./resetpasswordtokens.routes.js";
import { transactionsRoutes } from "./transactions.routes.js";
import { usersRoutes } from "./users.routes.js";

export const routes = (app: express.Express) => {
  app.use("/auth", authenticationsRoutes);
  app.use("/reset-password", resetPasswordsRoutes);

  app.use("/users", authMiddleware, usersRoutes);
  app.use("/categories", authMiddleware, categoriesRoutes);
  app.use("/transactions", authMiddleware, transactionsRoutes);
  app.use("/budgets", authMiddleware, budgetsRoutes);
  app.use("/reports", authMiddleware, reportsRoutes);
};
