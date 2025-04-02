export interface TransactionTest {
  id?: string;
  amount: number | null;
  type: string | null;
  payment_method: string | null;
  date: Date | null;
  note: string | null;
  user_id: string | null;
  category_id: string | null;
}

export const generateTransaction = (
  overrides: Partial<TransactionTest> = {}
): TransactionTest => ({
  amount: overrides.amount !== undefined ? overrides.amount : 299,
  type: overrides.type !== undefined ? overrides.type : "income",
  payment_method:
    overrides.payment_method !== undefined ? overrides.payment_method : "cash",
  date: overrides.date !== undefined ? overrides.date : new Date(),
  note: overrides.note !== undefined ? overrides.note : "allowance",
  user_id: overrides.user_id ?? null,
  category_id: overrides.category_id ?? null,
});
