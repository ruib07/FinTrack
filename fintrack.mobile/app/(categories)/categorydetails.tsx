import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
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
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Modal, View } from "react-native";

export default function CategoryDetailsScreen() {
  const { t } = useTranslation();
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
      Alert.alert(t("categoryUpdated"));
    } catch {
      Alert.alert(t("errorCategoryUpdate"));
    }
  };

  const handleCategoryRemoval = async (categoryId: string) => {
    Alert.alert(
      t("messages.confirmDeletion"),
      t("confirmCategoryDeletionMessage"),
      [
        { text: t("actions.cancel"), style: "cancel" },
        {
          text: t("actions.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteCategory(categoryId);
              router.replace("/(tabs)/categories");
              Alert.alert(t("messages.success"), t("categoryRemoved"));
            } catch {
              Alert.alert(t("errorMessage" + t("tryAgain")));
            }
          },
        },
      ]
    );
  };

  if (!category) {
    return (
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        {t("messages.loading")}
      </ThemedText>
    );
  }

  return (
    <ParallaxScrollView
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
          <ThemedText type="defaultSemiBold">{t("labels.type")}: </ThemedText>
          <ThemedText type="default">{t(`types.${category.type}`)}</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", gap: 10 }}>
          <ThemedButton
            title={t("updateCategory")}
            onPress={() => {
              setEditingCategory(category);
              setModalVisible(true);
            }}
          />
          <ThemedButton
            title={t("removeCategory")}
            onPress={() => handleCategoryRemoval(category.id!)}
          />
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
                {t("editCategory")}
              </ThemedText>
              <ThemedText type="default" style={{ marginTop: 8 }}>
                {t("labels.name")}:
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
                {t("categoryIcon") + " " + t("optional")}:
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
                {t("labels.type")}:
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
                  { label: t("selection.chooseType"), value: "" },
                  { label: t("types.income"), value: "income" },
                  { label: t("types.expense"), value: "expense" },
                ]}
              />
              <ThemedView
                style={{
                  flexDirection: "row",
                  gap: 20,
                  justifyContent: "center",
                }}
              >
                <ThemedButton
                  title={t("actions.cancel")}
                  style={{ backgroundColor: "gray" }}
                  onPress={() => setModalVisible(false)}
                />
                <ThemedButton
                  title={t("actions.save")}
                  onPress={handleCategoryUpdate}
                />
              </ThemedView>
            </ThemedView>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}
