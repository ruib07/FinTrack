import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { createTransport } from "nodemailer";
import { ValidationError } from "../errors/validation.error.js";
import { ResetPasswordTokenRepository } from "../repositories/resetpasswordtoken.repository.js";
import { UserRepository } from "../repositories/user.repository.js";

export class ResetPasswordService {
  private resetTokenRepository = new ResetPasswordTokenRepository();
  private userRepository = new UserRepository();

  private generateResetToken(): string {
    return randomBytes(32).toString("hex");
  }

  async sendPasswordResetEmail(userEmail: string): Promise<void> {
    const user = await this.userRepository.getByEmail(userEmail);

    if (!user) return;

    const token = this.generateResetToken();
    const expirydate = new Date();
    expirydate.setHours(expirydate.getHours() + 1);

    await this.resetTokenRepository.create({
      token,
      expirydate,
      user_id: user!.id,
    });

    const resetLink = `http://localhost:3000/change-password?token=${token}`;

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<void> {
    if (newPassword !== confirmNewPassword)
      throw new ValidationError("Passwords do not match.");

    const tokenRecord = await this.resetTokenRepository.findByToken(token);

    if (!tokenRecord || new Date() > tokenRecord.expirydate)
      throw new ValidationError("Invalid or expired token.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (tokenRecord.user_id) {
      await this.userRepository.update(tokenRecord.user_id, {
        password: hashedPassword,
      });
    } else {
      throw new ValidationError("No associated user found for this token.");
    }

    await this.resetTokenRepository.deleteByToken(token);
  }
}
