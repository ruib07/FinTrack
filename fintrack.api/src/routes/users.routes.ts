import { Router } from "express";
import asyncHandler from "express-async-handler";
import { UsersController } from "../controllers/users.controller.js";

export const usersRoutes = Router();

usersRoutes.get("/", asyncHandler(UsersController.getAll));
usersRoutes.get("/:id", asyncHandler(UsersController.getById));
usersRoutes.put("/:id", asyncHandler(UsersController.update));
usersRoutes.delete("/:id", asyncHandler(UsersController.delete));
