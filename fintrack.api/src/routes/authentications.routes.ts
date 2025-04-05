import { Router } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticationsController } from "../controllers/authentications.controller.js";

export const authenticationsRoutes = Router();

authenticationsRoutes.post(
  "/signin",
  asyncHandler(AuthenticationsController.signin),
);
authenticationsRoutes.post(
  "/signup",
  asyncHandler(AuthenticationsController.signup),
);
