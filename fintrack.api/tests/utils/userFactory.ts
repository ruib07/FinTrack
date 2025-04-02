import { v4 } from "uuid";

export interface UserTest {
  id?: string;
  name: string | null;
  email: string | null;
  password: string | null;
  currency: string | null;
}

export const generateUser = (overrides: Partial<UserTest> = {}): UserTest => ({
  name: overrides.name !== undefined ? overrides.name : `User/${v4()}`,
  email: overrides.email !== undefined ? overrides.email : `${v4()}@email.com`,
  password:
    overrides.password !== undefined ? overrides.password : "User@Test-123",
  currency: overrides.currency !== undefined ? overrides.currency : "EUR",
});
