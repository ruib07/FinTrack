export interface IBudget {
  id?: string;
  limit_amount: number;
  start_date: Date;
  end_date: Date;
  user_id: string;
  category_id: string;
}
