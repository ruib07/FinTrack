import { ITransaction } from "@/types/transaction";

export const processIncomesForYear = (
  transactions: ITransaction[],
  monthsOfYear: string[]
) => {
  const monthlyIncomes = monthsOfYear.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {} as Record<string, number>);

  transactions
    .filter((t) => t.type === "income")
    .forEach((t) => {
      const date = new Date(t.date);
      const month = date.getMonth();
      const monthName = monthsOfYear[month];

      if (monthsOfYear.includes(monthName)) {
        monthlyIncomes[monthName] += parseFloat(t.amount.toString());
      }
    });

  return monthsOfYear.map((month) => ({
    month,
    totalamount: monthlyIncomes[month],
  }));
};

export const processExpensesForYear = (
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
      const date = new Date(t.date);
      const month = date.getMonth();
      const monthName = monthsOfYear[month];

      if (monthsOfYear.includes(monthName)) {
        monthlyExpenses[monthName] += parseFloat(t.amount.toString());
      }
    });

  return monthsOfYear.map((month) => ({
    month,
    totalamount: monthlyExpenses[month],
  }));
};
