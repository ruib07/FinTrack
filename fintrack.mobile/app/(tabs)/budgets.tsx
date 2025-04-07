import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GetBudgetsByUser } from "@/services/budgets.service";
import { GetCategoriesByUser } from "@/services/categories.service";
import globalStyles from "@/styles/globalStyles";
import { IBudget } from "@/types/budget";
import { currencyLabels } from "@/utils/dictionaries";
import { storage } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("");

  const tableBackground = useThemeColor({}, "tableHeader");
  const rowBackground = useThemeColor({}, "tableRow");

  useFocusEffect(
    useCallback(() => {
      const fetchBudgets = async () => {
        const userId = await storage.getItem("userId");
        const storedCurrency = await storage.getItem("currency");
        setCurrency(storedCurrency || "");

        if (!userId) return;

        try {
          const budgetsResponse = await GetBudgetsByUser(userId);
          setBudgets(budgetsResponse.data);

          const categoriesResponse = await GetCategoriesByUser(userId);
          const categoryOptions = categoriesResponse.data.map(
            (category: any) => ({
              label: category.name,
              value: category.id,
            })
          );
          setCategories(categoryOptions);
        } catch {
          setError("Failed to load budgets.");
        }
      };

      fetchBudgets();
    }, [])
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.value === categoryId);
    return category ? category.label : "Unknown Category";
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      <ThemedView style={globalStyles.stepContainer}>
        <ThemedText type="subtitle">Budgets</ThemedText>
        <TouchableOpacity
          style={[globalStyles.button, { marginBottom: 4 }]}
          onPress={() => router.push("/(budgets)/addbudget")}
        >
          <ThemedText style={globalStyles.buttonText}>Add Budget</ThemedText>
        </TouchableOpacity>
        <DataTable>
          <DataTable.Header style={{ backgroundColor: tableBackground }}>
            <DataTable.Title>
              <ThemedText type="table">Limit Amount</ThemedText>
            </DataTable.Title>
            <DataTable.Title>
              <ThemedText type="table">Category</ThemedText>
            </DataTable.Title>
          </DataTable.Header>

          {budgets.map((budget, index) => (
            <DataTable.Row
              key={index}
              style={{ backgroundColor: rowBackground }}
            >
              <DataTable.Cell>
                <ThemedText type="table">
                  {budget.limit_amount} {currencyLabels[currency]}
                </ThemedText>
              </DataTable.Cell>
              <DataTable.Cell>
                <ThemedText type="table">
                  {getCategoryName(budget.category_id)}
                </ThemedText>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ThemedView>
    </ParallaxScrollView>
  );
}
