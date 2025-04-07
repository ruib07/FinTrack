import ParallaxScrollView from "@/components/ParallaxScrollView";
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
import { useState } from "react";
import { Alert, Button, Image, Platform, TouchableOpacity } from "react-native";

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState<string>();
  const [type, setType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState<Date>();
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
      date: date ?? new Date(),
      note: note || undefined,
      user_id: userId!,
      category_id: categoryId,
    };

    try {
      await CreateTransaction(newTransaction);
      Alert.alert("Transaction created successfully.");
      router.push("/(tabs)/transactions");
    } catch {
      Alert.alert("Something went wrong.");
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
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Transaction Creation
        </ThemedText>
        <ThemedView style={formStyles.formField}>
          <ThemedInput
            keyboardType="decimal-pad"
            onChangeText={(value) => {
              const cleanValue = value.replace(",", ".");
              setAmount(cleanValue);
            }}
            value={amount}
            placeholder="Amount"
          />
          <ThemedInput
            onChangeText={setNote}
            placeholder="Note (optional)"
            value={note ?? ""}
          />
          <Button title="Select Date" onPress={() => setShowDatePicker(true)} />

          {date && (
            <ThemedText style={{ marginVertical: 10 }}>
              Date: {date.toLocaleString()}
            </ThemedText>
          )}

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
          Choose your type:
        </ThemedText>
        <ThemedModal
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          items={[
            { label: "Select a type...", value: "" },
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
          ]}
        />
        <ThemedText type="default" style={{ marginTop: 8, marginBottom: 8 }}>
          Choose payment method:
        </ThemedText>
        <ThemedModal
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          items={[
            { label: "Select a payment method...", value: "" },
            { label: "Credit Card", value: "credit" },
            { label: "Debit Card", value: "debit" },
            { label: "MB Way", value: "mbway" },
            { label: "Cash", value: "cash" },
          ]}
        />
        <ThemedText type="default" style={{ marginTop: 8, marginBottom: 8 }}>
          Choose a category:
        </ThemedText>
        <ThemedModal
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
          items={categories}
        />
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleTransactionCreation}
        >
          <ThemedText style={globalStyles.buttonText}>
            Create Transaction
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}
