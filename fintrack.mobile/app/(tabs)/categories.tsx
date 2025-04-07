import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GetCategoriesByUser } from "@/services/categories.service";
import globalStyles from "@/styles/globalStyles";
import { ICategory } from "@/types/category";
import { typeLabels } from "@/utils/dictionaries";
import { storage } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";

export default function CategoriesScreen() {
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
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      <ThemedView style={globalStyles.stepContainer}>
        <ThemedText type="subtitle">Categories</ThemedText>
        <TouchableOpacity
          style={[globalStyles.button, { marginBottom: 4 }]}
          onPress={() => router.push("/(categories)/addcategory")}
        >
          <ThemedText style={globalStyles.buttonText}>Add Category</ThemedText>
        </TouchableOpacity>
        <DataTable>
          <DataTable.Header style={{ backgroundColor: tableBackground }}>
            <DataTable.Title>
              <ThemedText type="table">Name</ThemedText>
            </DataTable.Title>
            <DataTable.Title>
              <ThemedText type="table">Type</ThemedText>
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
                  {typeLabels[category.type]}
                </ThemedText>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ThemedView>
    </ParallaxScrollView>
  );
}
