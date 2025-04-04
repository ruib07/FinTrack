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
import { useFont } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { CartesianChart, Line } from "victory-native";
import spacemono from "../../assets/fonts/SpaceMono-Regular.ttf";

const processExpensesForYear = (
  transactions: ITransaction[],
  monthsOfYear: string[]
) => {
  const monthlyExpenses = monthsOfYear.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {} as Record<string, number>);

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
      });
      if (monthsOfYear.includes(month)) {
        monthlyExpenses[month] += parseFloat(t.amount.toString());
      }
    });

  return monthsOfYear.map((month) => ({
    month,
    totalamount: monthlyExpenses[month],
  }));
};

export default function HomeScreen() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const font = useFont(spacemono, 10);
  const labelColor = useThemeColor({}, "text");

  useEffect(() => {
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
  }, [userId]);

  const expenses = processExpensesForYear(transactions, monthsOfYear);

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
          <ThemedText type="subtitle" style={{ textAlign: "center" }}>
            Expenses for the year {new Date().getFullYear()}
          </ThemedText>

          {expenses.length > 0 ? (
            <ThemedView style={{ height: 300 }}>
              <CartesianChart
                data={expenses}
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
          ) : (
            <ThemedText style={{ textAlign: "center" }}>
              No expense data available for the year.
            </ThemedText>
          )}
        </>
      )}
    </ParallaxScrollView>
  );
}
