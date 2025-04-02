import { v4 } from "uuid";

export interface CategoryTest {
  id?: string;
  name: string | null;
  type: string | null;
  icon: string | null;
}

export const generateCategory = (
  overrides: Partial<CategoryTest> = {}
): CategoryTest => ({
  name: overrides.name !== undefined ? overrides.name : `Category/${v4()}`,
  type: overrides.type !== undefined ? overrides.type : "income",
  icon:
    overrides.icon !== undefined
      ? overrides.icon
      : "https://img.icons8.com/?size=100&id=1349&format=png&color=000000",
});
