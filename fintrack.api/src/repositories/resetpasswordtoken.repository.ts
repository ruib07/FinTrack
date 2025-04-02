import db from "../config/db.js";
import { ResetPasswordToken } from "../models/resetpasswordtoken.model.js";

export class ResetPasswordTokenRepository {
  async create(
    tokenData: Partial<ResetPasswordToken>
  ): Promise<ResetPasswordToken> {
    const [newToken] = await db<ResetPasswordToken>("resetpasswordtokens")
      .insert(tokenData)
      .returning("*");
    return newToken;
  }

  async findByToken(token: string): Promise<ResetPasswordToken | null> {
    const tokenRecord = await db<ResetPasswordToken>("resetpasswordtokens")
      .where({ token })
      .first();
    return tokenRecord ?? null;
  }

  async deleteByToken(token: string): Promise<number> {
    return db("resetpasswordtokens").where({ token }).del();
  }
}
