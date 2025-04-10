import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GetCategoryByID } from "@/services/categories.service";
import { GetTransactionByID } from "@/services/transactions.service";
import globalStyles from "@/styles/globalStyles";
import { ITransaction } from "@/types/transaction";
import { currencyLabels, paymentMethodLabels } from "@/utils/dictionaries";
import { storage } from "@/utils/storage";
import { useSearchParams } from "expo-router/build/hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";

export default function TransactionDetailsScreen() {
  const { t } = useTranslation();
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTransactionAndCategory = async () => {
      const storedCurrency = await storage.getItem("currency");
      setCurrency(storedCurrency || "");

      const id = searchParams.get("id");
      if (!id) return;

      try {
        const transactionResponse = await GetTransactionByID(id);
        setTransaction(transactionResponse.data);

        const categoryResponse = await GetCategoryByID(
          transactionResponse.data.category_id
        );

        setCategoryName(categoryResponse.data.name);
      } catch {
        setError("Failed to load transaction.");
      }
    };

    fetchTransactionAndCategory();
  }, [searchParams]);

  if (!transaction) {
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
        <ThemedText type="title" style={{ marginBottom: 20 }}>
          {t("transactionDetails")}
        </ThemedText>
        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">
            💰 {t("labels.amount")}:{" "}
          </ThemedText>
          <ThemedText type="default">
            {transaction.amount} {currencyLabels[currency]}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">
            🔄 {t("labels.type")}:{" "}
          </ThemedText>
          <ThemedText type="default">
            {t(`types.${transaction.type}`)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">
            💳 {t("labels.paymentMethod")}:{" "}
          </ThemedText>
          <ThemedText type="default">
            {paymentMethodLabels[transaction.payment_method]}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">
            📅 {t("labels.date")}:{" "}
          </ThemedText>
          <ThemedText type="default">
            {moment(transaction.date).format("DD/MM/YYYY HH:mm")}
          </ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">
            ✏️ {t("labels.note")}:{" "}
          </ThemedText>
          <ThemedText type="default">{transaction.note || "None"}</ThemedText>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">📌 {t("category")}: </ThemedText>
          <ThemedText type="default">{categoryName}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
