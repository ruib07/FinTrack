export interface IBudget {
  id?: string;
  limit_amount: number;
  start_date: string;
  end_date: string;
  user_id: string;
  category_id: string;
}
