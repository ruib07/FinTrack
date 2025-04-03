import { IBudget } from "@/types/budget";
import apiRequest from "./helpers/api.service";

const route = "budgets";

export const GetBudgets = async () => apiRequest("GET", route, undefined, true);

export const GetBudgetByID = async (budgetId: string) =>
  apiRequest("GET", `${route}/${budgetId}`, undefined, true);

export const GetBudgetsByUser = async (userId: string) =>
  apiRequest("GET", `${route}/by-user/${userId}`, undefined, true);

export const GetBudgetsByCategory = async (categoryId: string) =>
  apiRequest("GET", `${route}/by-category/${categoryId}`, undefined, true);

export const CreateBudget = async (newBudget: IBudget) =>
  apiRequest("POST", route, newBudget, true);

export const UpdateBudget = async (
  budgetId: string,
  updateBudget: Partial<IBudget>
) => apiRequest("PUT", `${route}/${budgetId}`, updateBudget, true);

export const DeleteBudget = async (budgetId: string) =>
  apiRequest("DELETE", `${route}/${budgetId}`, undefined, true);
