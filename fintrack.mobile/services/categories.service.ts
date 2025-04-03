import { ICategory } from "@/types/category";
import apiRequest from "./helpers/api.service";

const route = "categories";

export const GetCategories = async () =>
  apiRequest("GET", route, undefined, true);

export const GetCategoryByID = async (categoryId: string) =>
  apiRequest("GET", `${route}/${categoryId}`, undefined, true);

export const CreateCategory = async (newCategory: ICategory) =>
  apiRequest("POST", route, newCategory, true);

export const UpdateCategory = async (
  categoryId: string,
  updateCategory: Partial<ICategory>
) => apiRequest("PUT", `${route}/${categoryId}`, updateCategory, true);

export const DeleteCategory = async (categoryId: string) =>
  apiRequest("DELETE", `${route}/${categoryId}`, undefined, true);
