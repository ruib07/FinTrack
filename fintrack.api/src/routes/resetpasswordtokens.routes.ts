import { Router } from "express";
import asyncHandler from "express-async-handler";
import { ResetPasswordsController } from "../controllers/resetpasswordtokens.controller.js";

export const resetPasswordsRoutes = Router();

resetPasswordsRoutes.post(
  "/send-email",
  asyncHandler(ResetPasswordsController.requestPasswordReset)
);
resetPasswordsRoutes.put(
  "/change-password",
  asyncHandler(ResetPasswordsController.changePassword)
);
