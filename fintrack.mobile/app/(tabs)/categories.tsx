import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GetCategoriesByUser } from "@/services/categories.service";
import globalStyles from "@/styles/globalStyles";
import { ICategory } from "@/types/category";
import { storage } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import { DataTable } from "react-native-paper";

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [, setError] = useState<string | null>(null);

  const tableBackground = useThemeColor({}, "tableHeader");
  const rowBackground = useThemeColor({}, "tableRow");

  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        const userId = await storage.getItem("userId");

        if (!userId) return;

        try {
          const response = await GetCategoriesByUser(userId);
          setCategories(response.data);
        } catch {
          setError("Failed to load categories.");
        }
      };

      fetchCategories();
    }, [])
  );

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      <ThemedView style={globalStyles.stepContainer}>
        <ThemedText type="subtitle">{t("categories")}</ThemedText>
        <ThemedButton
          title={t("addCategory")}
          onPress={() => router.push("/(categories)/addcategory")}
        />
        <DataTable style={{ marginTop: 10 }}>
          <DataTable.Header style={{ backgroundColor: tableBackground }}>
            <DataTable.Title>
              <ThemedText type="table" style={{ color: "#fff" }}>
                {t("labels.name")}
              </ThemedText>
            </DataTable.Title>
            <DataTable.Title>
              <ThemedText type="table" style={{ color: "#fff" }}>
                {t("labels.type")}
              </ThemedText>
            </DataTable.Title>
          </DataTable.Header>

          {categories.map((category, index) => (
            <DataTable.Row
              key={index}
              style={{ backgroundColor: rowBackground }}
            >
              <DataTable.Cell>
                <ThemedText
                  type="table"
                  onPress={() =>
                    router.push(
                      `/(categories)/categorydetails?id=${category.id}`
                    )
                  }
                >
                  {category.name}
                </ThemedText>
              </DataTable.Cell>
              <DataTable.Cell>
                <ThemedText type="table">
                  {t(`types.${category.type}`)}
                </ThemedText>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ThemedView>
    </ParallaxScrollView>
  );
}
