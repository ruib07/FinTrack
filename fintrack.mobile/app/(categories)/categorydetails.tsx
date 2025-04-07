import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  DeleteCategory,
  GetCategoryByID,
  UpdateCategory,
} from "@/services/categories.service";
import globalStyles from "@/styles/globalStyles";
import modalStyles from "@/styles/modalStyles";
import { ICategory } from "@/types/category";
import { typeLabels } from "@/utils/dictionaries";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, TouchableOpacity, View } from "react-native";

export default function CategoryDetailsScreen() {
  const [category, setCategory] = useState<ICategory | null>(null);
  const [, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategory = async () => {
      const id = searchParams.get("id");
      if (!id) return;

      try {
        const response = await GetCategoryByID(id);
        setCategory(response.data);
      } catch {
        setError("Failed to load category.");
      }
    };

    fetchCategory();
  }, [searchParams]);

  const handleCategoryUpdate = async () => {
    if (!editingCategory) return;

    try {
      await UpdateCategory(editingCategory.id!, editingCategory);
      setCategory(editingCategory);
      setModalVisible(false);
      Alert.alert("Category updated successfully.");
    } catch {
      Alert.alert("Error updating category.");
    }
  };

  const handleCategoryRemoval = async (categoryId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure that you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteCategory(categoryId);
              router.replace("/(tabs)/categories");
              Alert.alert("Success", "Category removed successfully.");
            } catch {
              Alert.alert("Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  if (!category) {
    return (
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Loading...
      </ThemedText>
    );
  }

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
      <ThemedView style={globalStyles.container}>
        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {category.icon ? (
            <Image
              source={{ uri: category.icon }}
              style={{ width: 24, height: 24, marginRight: 8 }}
              resizeMode="contain"
            />
          ) : null}
          <ThemedText type="title">{category.name}</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">Type: </ThemedText>
          <ThemedText type="default">{typeLabels[category.type]}</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              setEditingCategory(category);
              setModalVisible(true);
            }}
          >
            <ThemedText style={globalStyles.buttonText}>
              Update Category
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => handleCategoryRemoval(category.id!)}
          >
            <ThemedText style={globalStyles.buttonText}>
              Remove Category
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {modalVisible && editingCategory && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={modalStyles.container}>
            <ThemedView style={modalStyles.content}>
              <ThemedText type="title" style={{ textAlign: "center" }}>
                Edit Category
              </ThemedText>
              <ThemedText type="default" style={{ marginTop: 8 }}>
                Name:
              </ThemedText>
              <ThemedInput
                value={editingCategory.name}
                onChangeText={(text) =>
                  setEditingCategory((prev) =>
                    prev ? { ...prev, name: text } : prev
                  )
                }
              />
              <ThemedText type="default" style={{ marginTop: 8 }}>
                Icon (optional):
              </ThemedText>
              <ThemedInput
                value={editingCategory.icon ?? ""}
                onChangeText={(text) =>
                  setEditingCategory((prev) =>
                    prev ? { ...prev, icon: text } : prev
                  )
                }
              />
              <ThemedText type="default" style={{ marginTop: 8 }}>
                Type:
              </ThemedText>
              <ThemedModal
                selectedValue={editingCategory.type}
                onValueChange={(value) =>
                  setEditingCategory((prev) =>
                    prev
                      ? { ...prev, type: value as "expense" | "income" }
                      : prev
                  )
                }
                items={[
                  { label: "Select a type...", value: "" },
                  { label: "Income", value: "income" },
                  { label: "Expense", value: "expense" },
                ]}
              />
              <ThemedView
                style={{
                  flexDirection: "row",
                  gap: 20,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={[globalStyles.button, { backgroundColor: "gray" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText style={globalStyles.buttonText}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.button}
                  onPress={handleCategoryUpdate}
                >
                  <ThemedText style={globalStyles.buttonText}>Save</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}
