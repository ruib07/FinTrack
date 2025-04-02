export interface ChangePasswordTest {
  token: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}

export const generateChangePassword = (
  overrides: Partial<ChangePasswordTest> = {}
): ChangePasswordTest => ({
  token: overrides.token !== undefined ? overrides.token : "validtoken456",
  newPassword:
    overrides.newPassword !== undefined
      ? overrides.newPassword
      : "New@Password-123",
  confirmNewPassword:
    overrides.confirmNewPassword !== undefined
      ? overrides.confirmNewPassword
      : "New@Password-123",
});
