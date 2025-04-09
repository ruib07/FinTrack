import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUserId } from "@/hooks/useUserId";
import {
  DeleteBudget,
  GetBudgetByID,
  UpdateBudget,
} from "@/services/budgets.service";
import {
  GetCategoriesByUser,
  GetCategoryByID,
} from "@/services/categories.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import modalStyles from "@/styles/modalStyles";
import { IBudget } from "@/types/budget";
import { storage } from "@/utils/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

export default function BudgetDetailsScreen() {
  const [budget, setBudget] = useState<IBudget | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("");
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [allCategories, setAllCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const searchParams = useSearchParams();
  const { userId } = useUserId();

  useEffect(() => {
    const fetchBudgetAndCategory = async () => {
      const storedCurrency = await storage.getItem("currency");
      setCurrency(storedCurrency || "");

      const id = searchParams.get("id");

      if (!id) return;
      if (!userId) return;

      try {
        const budgetResponse = await GetBudgetByID(id);
        setBudget(budgetResponse.data);

        const categoryResponse = await GetCategoryByID(
          budgetResponse.data.category_id
        );
        setCategoryName(categoryResponse.data.name);

        const categories = await GetCategoriesByUser(userId);
        setAllCategories(
          categories.data.map((cat: any) => ({
            label: cat.name,
            value: cat.id,
          }))
        );
      } catch {
        setError("Failed to load budget.");
      }
    };

    fetchBudgetAndCategory();
  }, [searchParams]);

  const handleBudgetUpdate = async () => {
    if (!editingBudget) return;

    try {
      await UpdateBudget(editingBudget.id!, editingBudget);
      setBudget(editingBudget);
      setModalVisible(false);
      Alert.alert("Budget updated successfully.");
    } catch {
      Alert.alert("Error updating budget.");
    }
  };

  const handleBudgetRemoval = async (budgetId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure that you want to delete this budget?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await DeleteBudget(budgetId);
              router.replace("/(tabs)/budgets");
              Alert.alert("Success", "Budget removed successfully.");
            } catch {
              Alert.alert("Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  if (!budget) {
    return (
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Loading...
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
          <ThemedText type="title">Budget Details</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">💰 Limit Amount: </ThemedText>
          <ThemedText type="default">{budget.limit_amount}</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">📅 Start Date: </ThemedText>
          <ThemedText type="default">
            {moment(budget.start_date).format("DD/MM/YYYY")}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">📅 End Date: </ThemedText>
          <ThemedText type="default">
            {moment(budget.end_date).format("DD/MM/YYYY")}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">📌 Category: </ThemedText>
          <ThemedText type="default">{categoryName}</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", gap: 10 }}>
          <ThemedButton
            title="Update Budget"
            onPress={() => {
              setEditingBudget(budget);
              setModalVisible(true);
            }}
          />
          <ThemedButton
            title="Remove Budget"
            onPress={() => handleBudgetRemoval(budget.id!)}
          />
        </ThemedView>
      </ThemedView>

      {modalVisible && editingBudget && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={modalStyles.container}>
            <ThemedView style={modalStyles.content}>
              <ThemedText type="title" style={{ textAlign: "center" }}>
                Edit Budget
              </ThemedText>
              <ThemedText type="default" style={{ marginTop: 8 }}>
                Limit Amount:
              </ThemedText>
              <ThemedInput
                keyboardType="decimal-pad"
                value={editingBudget.limit_amount.toString()}
                onChangeText={(amount) =>
                  setEditingBudget((prev) =>
                    prev ? { ...prev, limit_amount: parseFloat(amount) } : prev
                  )
                }
              />
              <ThemedText type="default" style={{ marginTop: 8 }}>
                Start Date:
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                style={formStyles.dateInputButton}
              >
                <ThemedText>
                  {moment(editingBudget.start_date).format("DD/MM/YYYY")}
                </ThemedText>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={new Date(editingBudget.start_date)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setEditingBudget((prev) =>
                        prev
                          ? { ...prev, start_date: selectedDate.toISOString() }
                          : prev
                      );
                    }
                  }}
                />
              )}

              <ThemedText type="default" style={{ marginTop: 8 }}>
                End Date:
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={formStyles.dateInputButton}
              >
                <ThemedText>
                  {moment(editingBudget.end_date).format("DD/MM/YYYY")}
                </ThemedText>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date(editingBudget.end_date)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setEditingBudget((prev) =>
                        prev
                          ? { ...prev, end_date: selectedDate.toISOString() }
                          : prev
                      );
                    }
                  }}
                />
              )}

              <ThemedText type="default" style={{ marginTop: 8 }}>
                Category:
              </ThemedText>
              <ThemedModal
                selectedValue={editingBudget.category_id}
                onValueChange={(value) =>
                  setEditingBudget((prev) =>
                    prev ? { ...prev, category_id: value } : prev
                  )
                }
                items={allCategories}
              />
              <ThemedView
                style={{
                  flexDirection: "row",
                  gap: 20,
                  justifyContent: "center",
                }}
              >
                <ThemedButton
                  title="Cancel"
                  style={{ backgroundColor: "gray" }}
                  onPress={() => setModalVisible(false)}
                />
                <ThemedButton title="Save" onPress={handleBudgetUpdate} />
              </ThemedView>
            </ThemedView>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}
