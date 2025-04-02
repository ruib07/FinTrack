export interface ResetPasswordToken {
  id: string;
  token: string;
  expirydate: Date;
  user_id: string;
}
