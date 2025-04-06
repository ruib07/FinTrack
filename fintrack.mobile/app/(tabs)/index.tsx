import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { monthsOfYear } from "@/constants/Months";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GetTransactionsByUser } from "@/services/transactions.service";
import { GetUserById } from "@/services/users.service";
import globalStyles from "@/styles/globalStyles";
import { ITransaction } from "@/types/transaction";
import { processExpensesForYear } from "@/utils/expenses";
import { processIncomesForYear } from "@/utils/incomes";
import { useFont } from "@shopify/react-native-skia";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image } from "react-native";
import { Bar, CartesianChart, Line, Pie, PolarChart } from "victory-native";
import spacemono from "../../assets/fonts/SpaceMono-Regular.ttf";
import chartStyles from "@/styles/chartStyles";

export default function HomeScreen() {
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
    { x: "Expenses", y: totalExpenses, color: "#1D3D47" },
    { x: "Incomes", y: totalIncomes, color: "#A1CEDC" },
  ];

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
      <ThemedView style={globalStyles.titleContainer}>
        <ThemedText type="title">Welcome {user?.name}!</ThemedText>
        <HelloWave />
      </ThemedView>

      {!user ? (
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Need to authenticate!
        </ThemedText>
      ) : (
        <>
          {expenses.length > 0 && incomes.length > 0 ? (
            <>
              <ThemedText
                type="subtitle"
                style={{ textAlign: "center", marginTop: 20 }}
              >
                Expenses vs Incomes
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
                Expenses for the year {new Date().getFullYear()}
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
                      color="#1D3D47"
                    />
                  )}
                </CartesianChart>
              </ThemedView>

              <ThemedText
                type="subtitle"
                style={{ textAlign: "center", marginTop: 10 }}
              >
                Incomes for the year {new Date().getFullYear()}
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
                      color="#1D3D47"
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
