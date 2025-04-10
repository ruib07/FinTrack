import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedModal } from "@/components/ThemedModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCategoriesByUser } from "@/hooks/useCategoriesByUser";
import { useUserId } from "@/hooks/useUserId";
import { CreateTransaction } from "@/services/transactions.service";
import formStyles from "@/styles/formStyles";
import globalStyles from "@/styles/globalStyles";
import { ITransaction } from "@/types/transaction";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Platform, TouchableOpacity } from "react-native";

export default function AddTransactionScreen() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>();
  const [type, setType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { userId } = useUserId();
  const { categories } = useCategoriesByUser(userId);

  const handleTransactionCreation = async () => {
    const newTransaction: ITransaction = {
      amount: Number(amount) ?? 0,
      type,
      payment_method: paymentMethod,
      date: date,
      note: note || undefined,
      user_id: userId!,
      category_id: categoryId,
    };

    try {
      await CreateTransaction(newTransaction);
      Alert.alert(t("addTransactionSuccess"));
      router.push("/(tabs)/transactions");
    } catch {
      Alert.alert(t("messages.errorMessage"));
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime: Date | undefined
  ) => {
    if (selectedTime) {
      const newDate = new Date(date!);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
    setShowTimePicker(false);
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
          {t("transactionCreation")}
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            keyboardType="decimal-pad"
            onChangeText={(value) => {
              const cleanValue = value.replace(",", ".");
              setAmount(cleanValue);
            }}
            value={amount}
            placeholder={t("labels.amount")}
          />
          <ThemedInput
            onChangeText={setNote}
            placeholder={t("labels.note") + " " + t("optional")}
            value={note ?? ""}
          />

          <ThemedText type="default" style={{ marginTop: 8 }}>
            {t("labels.date")}:
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={formStyles.dateInputButton}
          >
            <ThemedText>{moment(date).format("D/M/YYYY HH:mm")}</ThemedText>
          </TouchableOpacity>

          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={date || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {showDatePicker && Platform.OS === "ios" && (
            <DateTimePicker
              value={date || new Date()}
              mode="datetime"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </ThemedView>
        <ThemedText type="default" style={{ marginBottom: 8 }}>
          {t("selection.chooseType")}
        </ThemedText>
        <ThemedModal
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          items={[
            { label: t("selection.typeSelection"), value: "" },
            { label: t("types.income"), value: "income" },
            { label: t("types.expense"), value: "expense" },
          ]}
        />
        <ThemedText type="default" style={{ marginTop: 8, marginBottom: 8 }}>
          {t("selection.choosePaymentMethod")}
        </ThemedText>
        <ThemedModal
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          items={[
            { label: t("selection.paymentMethodSelection"), value: "" },
            { label: t("paymentMethods.creditCard"), value: "credit" },
            { label: t("paymentMethods.debitCard"), value: "debit" },
            { label: "MB Way", value: "mbway" },
            { label: t("paymentMethods.cash"), value: "cash" },
          ]}
        />
        <ThemedText type="default" style={{ marginTop: 8, marginBottom: 8 }}>
          {t("selection.chooseCategory")}
        </ThemedText>
        <ThemedModal
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
          items={categories}
        />
        <ThemedButton
          title={t("createTransaction")}
          onPress={handleTransactionCreation}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}
