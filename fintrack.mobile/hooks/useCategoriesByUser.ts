import { GetCategoriesByUser } from "@/services/categories.service";
import { useEffect, useState } from "react";

export const useCategoriesByUser = (userId: string | null) => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      try {
        const response = await GetCategoriesByUser(userId);
        const categoryOptions = response.data.map((category: any) => ({
          label: category.name,
          value: category.id,
        }));
        setCategories(categoryOptions);
      } catch {
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, [userId]);

  return { categories, error };
};
