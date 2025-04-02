export interface BudgetTest {
  id?: string;
  limit_amount: number | null;
  start_date: Date | null;
  end_date: Date | null;
  user_id: string | null;
  category_id: string | null;
}

export const generateBudget = (
  overrides: Partial<BudgetTest> = {}
): BudgetTest => ({
  limit_amount:
    overrides.limit_amount !== undefined ? overrides.limit_amount : 299,
  start_date:
    overrides.start_date !== undefined ? overrides.start_date : new Date(),
  end_date: overrides.end_date !== undefined ? overrides.end_date : new Date(),
  user_id: overrides.user_id ?? null,
  category_id: overrides.category_id ?? null,
});
