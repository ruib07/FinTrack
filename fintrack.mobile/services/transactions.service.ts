import { ITransaction } from "@/types/transaction";
import apiRequest from "./helpers/api.service";

const route = "transactions";

export const GetTransactions = async () =>
  apiRequest("GET", route, undefined, true);

export const GetTransactionByID = async (transactionId: string) =>
  apiRequest("GET", `${route}/${transactionId}`, undefined, true);

export const GetTransactionsByUser = async (userId: string) =>
  apiRequest("GET", `${route}/by-user/${userId}`, undefined, true);

export const GetTransactionsByCategory = async (categoryId: string) =>
  apiRequest("GET", `${route}/by-category/${categoryId}`, undefined, true);

export const CreateTransaction = async (newTransaction: ITransaction) =>
  apiRequest("POST", route, newTransaction, true);
