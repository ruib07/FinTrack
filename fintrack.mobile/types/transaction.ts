export interface ITransaction {
  id?: string;
  amount: number;
  type: string;
  payment_method: string;
  date: Date;
  note?: string;
  user_id: string;
  category_id: string;
}
