import { Request, Response } from "express";
import { ResetPasswordService } from "../services/resetpasswordtoken.service.js";

export class ResetPasswordsController {
  static async requestPasswordReset(req: Request, res: Response) {
    await new ResetPasswordService().sendPasswordResetEmail(req.body.email);

    res.status(200).json({ message: "Email sent successfully." });
  }

  static async changePassword(req: Request, res: Response) {
    const { token, newPassword, confirmNewPassword } = req.body;

    await new ResetPasswordService().resetPassword(
      token,
      newPassword,
      confirmNewPassword,
    );

    res.status(200).json({ message: "Password changed successfully." });
  }
}
