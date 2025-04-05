export interface ITransaction {
  id?: string;
  amount: number;
  type: string;
  payment_method: string;
  date: string;
  note?: string;
  user_id: string;
  category_id: string;
}
