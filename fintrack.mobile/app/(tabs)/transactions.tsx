import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GetCategoryByID } from "@/services/categories.service";
import { GetTransactionsByUser } from "@/services/transactions.service";
import globalStyles from "@/styles/globalStyles";
import transactionStyles from "@/styles/transactionStyles";
import { ITransaction } from "@/types/transaction";
import { currencyLabels } from "@/utils/dictionaries";
import { storage } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";

export default function TransactionsScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        const userId = await storage.getItem("userId");
        const storedCurrency = await storage.getItem("currency");
        setCurrency(storedCurrency || "");

        if (!userId) return;

        try {
          const response = await GetTransactionsByUser(userId);
          setTransactions(response.data);

          const categoryNames: Record<string, string> = {};
          for (const transaction of response.data) {
            if (
              transaction.category_id &&
              !categoryNames[transaction.category_id]
            ) {
              const category = await GetCategoryByID(transaction.category_id);
              categoryNames[transaction.category_id] = category.data.name;
            }
          }
          setCategories(categoryNames);
        } catch {
          setError("Failed to load transactions.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchTransactions();
    }, [])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size={"large"} color="#444444" />
      </ThemedView>
    );
  }

  const filteredTransactions = transactions.filter((transaction) =>
    categories[transaction.category_id]
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView>
      <ThemedView style={globalStyles.stepContainer}>
        <ThemedText type="subtitle" style={{ marginTop: 100 }}>
          {t("transactions")}
        </ThemedText>
        <ThemedInput
          placeholder={t("searchTransaction")}
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={handleSearch}
          style={{ width: "90%" }}
        />
        <ThemedButton
          title={t("addTransaction")}
          onPress={() => router.push("/(transactions)/addtransaction")}
        />

        {filteredTransactions.map((transaction) => (
          <ThemedView style={transactionStyles.container} key={transaction.id}>
            <TouchableOpacity
              style={{
                padding: 15,
                marginVertical: 5,
                borderRadius: 8,
              }}
              onPress={() =>
                router.push(
                  `/(transactions)/transactiondetails?id=${transaction.id}`
                )
              }
            >
              <ThemedText type="subtitle">
                💰 {t("labels.amount")}: {transaction.amount}{" "}
                {currencyLabels[currency]}
              </ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 4 }}>
                📌 {t("category")}:{" "}
                {categories[transaction.category_id] || "Loading..."}
              </ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 4 }}>
                ✏️ {t("labels.note")}: {transaction.note || "None"}
              </ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 4 }}>
                📅 {t("labels.date")}:{" "}
                {moment(transaction.date).format("DD/MM/YYYY HH:mm")}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}
