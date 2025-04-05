import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GetCategoryByID } from "@/services/categories.service";
import { GetTransactionsByUser } from "@/services/transactions.service";
import globalStyles from "@/styles/globalStyles";
import transactionStyles from "@/styles/transactionStyles";
import { ITransaction } from "@/types/transaction";
import { storage } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";

export default function TransactionsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = await storage.getItem("userId");

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
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size={"large"} color="#1D3D47" />;
    </ThemedView>;
  }

  const filteredTransactions = transactions.filter((transaction) =>
    categories[transaction.category_id]
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={globalStyles.stepContainer}>
      <ThemedText type="subtitle" style={{ marginTop: 100 }}>
        Transactions
      </ThemedText>
      <ThemedInput
        placeholder="Search by category"
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={handleSearch}
        style={{ width: "90%" }}
      />
      <TouchableOpacity
        style={[globalStyles.button, { marginBottom: 4 }]}
        onPress={() => router.push("/(transactions)/addtransaction")}
      >
        <ThemedText style={globalStyles.buttonText}>Add Transaction</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <ThemedView style={transactionStyles.container}>
            <TouchableOpacity
              style={{
                padding: 15,
                marginVertical: 5,
                borderRadius: 8,
              }}
              //onPress={() => router.push(`/transaction?id=${item.id}`)}
            >
              <ThemedText type="subtitle">💰 Amount: {item.amount}</ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 4 }}>
                📌 Category: {categories[item.category_id] || "Loading..."}
              </ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 4 }}>
                ✏️ Note: {item.note || "None"}
              </ThemedText>
              <ThemedText type="subtitle" style={{ marginTop: 4 }}>
                📅 Date: {new Date(item.date).toLocaleDateString()}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}
