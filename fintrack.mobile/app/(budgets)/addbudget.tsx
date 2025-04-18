import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCategoriesByUser } from "@/hooks/useCategoriesByUser";
import { useUserId } from "@/hooks/useUserId";
import { CreateBudget } from "@/services/budgets.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { IBudget } from "@/types/budget";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Platform, TouchableOpacity } from "react-native";

export default function AddBudgetScreen() {
  const { t } = useTranslation();
  const [limitAmount, setLimitAmount] = useState<string>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [categoryId, setCategoryId] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { userId } = useUserId();
  const { categories } = useCategoriesByUser(userId);

  const handleBudgetCreation = async () => {
    const newBudget: IBudget = {
      limit_amount: Number(limitAmount),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      user_id: userId!,
      category_id: categoryId,
    };

    try {
      await CreateBudget(newBudget);
      Alert.alert(t("addBudgetSuccess"));
      router.push("/(tabs)/budgets");
    } catch {
      Alert.alert(t("messages.errorMessage"));
    }
  };

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
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          {t("budgetCreation")}
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            keyboardType="decimal-pad"
            onChangeText={(value) => {
              const cleanValue = value.replace(",", ".");
              setLimitAmount(cleanValue);
            }}
            value={limitAmount}
            placeholder={t("labels.limitAmount")}
          />

          <ThemedText type="default" style={{ marginTop: 8 }}>
            {t("labels.startDate")}:
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={formStyles.dateInputButton}
          >
            <ThemedText>{moment(startDate).format("D/M/YYYY")}</ThemedText>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          <ThemedText type="default" style={{ marginTop: 8 }}>
            {t("labels.endDate")}:
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={formStyles.dateInputButton}
          >
            <ThemedText>{moment(endDate).format("D/M/YYYY")}</ThemedText>
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </ThemedView>
        <ThemedText type="default" style={{ marginBottom: 8 }}>
          {t("selection.chooseCategory")}
        </ThemedText>
        <ThemedModal
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
          items={categories}
        />
        <ThemedButton
          title={t("createBudget")}
          onPress={handleBudgetCreation}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}
