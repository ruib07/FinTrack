import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { monthsOfYear } from "@/constants/Months";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GetTransactionsByUser } from "@/services/transactions.service";
import { GetUserById } from "@/services/users.service";
import chartStyles from "@/styles/chartStyles";
import globalStyles from "@/styles/globalStyles";
import { ITransaction } from "@/types/transaction";
import {
  processExpensesForYear,
  processIncomesForYear,
} from "@/utils/transactionAnalytics";
import { useFont } from "@shopify/react-native-skia";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import { Bar, CartesianChart, Line, Pie, PolarChart } from "victory-native";
import spacemono from "../../assets/fonts/SpaceMono-Regular.ttf";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const font = useFont(spacemono, 10);
  const labelColor = useThemeColor({}, "text");

  useFocusEffect(
    useCallback(() => {
      const fetchUserAndTransactions = async () => {
        if (!userId) {
          setUser(null);
          return;
        }

        try {
          const userResponse = await GetUserById(userId);
          setUser({ name: userResponse.data.name });

          const transactionsResponse = await GetTransactionsByUser(userId);
          setTransactions(transactionsResponse.data);
        } catch {
          setError("Failed to load user.");
        }
      };

      fetchUserAndTransactions();
    }, [userId])
  );

  const expenses = processExpensesForYear(transactions, monthsOfYear);
  const incomes = processIncomesForYear(transactions, monthsOfYear);

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.totalamount,
    0
  );
  const totalIncomes = incomes.reduce(
    (acc, income) => acc + income.totalamount,
    0
  );

  const pieData = [
    { x: t("expenses"), y: totalExpenses, color: "#ff0000" },
    { x: t("incomes"), y: totalIncomes, color: "#008000" },
  ];

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require("@/assets/images/fintrack-banner.jpg")}
          style={globalStyles.fintrackBanner}
        />
      }
    >
      {!user ? (
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          {t("needAuth")}
        </ThemedText>
      ) : (
        <>
          {expenses.length > 0 && incomes.length > 0 ? (
            <>
              <ThemedText
                type="subtitle"
                style={{ textAlign: "center", marginTop: 20 }}
              >
                {t("expensesVsIncomes")}
              </ThemedText>
              <ThemedView style={{ height: 200 }}>
                <PolarChart
                  data={pieData}
                  labelKey={"x"}
                  valueKey={"y"}
                  colorKey={"color"}
                >
                  <Pie.Chart />
                </PolarChart>
              </ThemedView>
              <ThemedView style={chartStyles.legendContainer}>
                {pieData.map((item, index) => (
                  <ThemedView key={index} style={chartStyles.legendItem}>
                    <ThemedView
                      style={[
                        chartStyles.colorBox,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <ThemedText style={chartStyles.legendText}>
                      {item.x}
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>

              <ThemedText
                type="subtitle"
                style={{ textAlign: "center", marginTop: 20 }}
              >
                {t("expensesForYear", { year: new Date().getFullYear() })}
              </ThemedText>

              <ThemedView style={{ height: 300 }}>
                <CartesianChart
                  data={expenses}
                  xKey="month"
                  yKeys={["totalamount"]}
                  axisOptions={{ font, labelColor }}
                >
                  {({ points, chartBounds }) => (
                    <Bar
                      points={points.totalamount}
                      chartBounds={chartBounds}
                      color="#ff0000"
                    />
                  )}
                </CartesianChart>
              </ThemedView>

              <ThemedText
                type="subtitle"
                style={{ textAlign: "center", marginTop: 10 }}
              >
                {t("incomesForYear", { year: new Date().getFullYear() })}
              </ThemedText>
              <ThemedView style={{ height: 300 }}>
                <CartesianChart
                  data={incomes}
                  xKey="month"
                  yKeys={["totalamount"]}
                  axisOptions={{ font, labelColor }}
                >
                  {({ points }) => (
                    <Line
                      points={points.totalamount}
                      color="#008000"
                      strokeWidth={3}
                    />
                  )}
                </CartesianChart>
              </ThemedView>
            </>
          ) : (
            <ThemedText style={{ textAlign: "center" }}>
              No data available for the year.
            </ThemedText>
          )}
        </>
      )}
    </ParallaxScrollView>
  );
}
