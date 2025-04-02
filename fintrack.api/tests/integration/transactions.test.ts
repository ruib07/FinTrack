import supertest, { Response } from "supertest";
import { v4 } from "uuid";
import app from "../../src/app";
import { generateCategory } from "../utils/categoryFactory";
import { createAndAuthenticateUser } from "../utils/test-helper";
import {
  generateTransaction,
  TransactionTest,
} from "../utils/transactionFactory";

const route = "/transactions";

let user: any;
let category: any;

beforeAll(async () => {
  user = await createAndAuthenticateUser();

  const categoryRegistration = generateCategory();

  const res: Response = await supertest(app)
    .post("/categories")
    .set("Authorization", `Bearer ${user.token}`)
    .send(categoryRegistration);

  category = res.body;
});

describe("Transaction Tests", () => {
  test("Should return all transactions", async () => {
    const res: Response = await supertest(app)
      .get(route)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return a transaction by ID", async () => {
    const transaction = generateTransaction({
      user_id: user.id,
      category_id: category.id,
    });

    const createTransactionRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(transaction);

    expect(createTransactionRes.status).toBe(201);

    const createdTransaction = createTransactionRes.body;

    const res: Response = await supertest(app)
      .get(`${route}/${createdTransaction.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return not found message when transaction does not exist", async () => {
    const res: Response = await supertest(app)
      .get(`${route}/${v4()}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Transaction not found.");
  });

  test("Should return all transactions when user ID is valid", async () => {
    const transaction = generateTransaction({
      user_id: user.id,
      category_id: category.id,
    });

    const createTransactionRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(transaction);

    expect(createTransactionRes.status).toBe(201);

    const res: Response = await supertest(app)
      .get(`${route}/by-user/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return all transaction when category ID is valid", async () => {
    const transaction = generateTransaction({
      user_id: user.id,
      category_id: category.id,
    });

    const createTransactionRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(transaction);

    expect(createTransactionRes.status).toBe(201);

    const res: Response = await supertest(app)
      .get(`${route}/by-category/${category.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should create a new transaction sucessfully", async () => {
    const newTransaction = generateTransaction({
      user_id: user.id,
      category_id: category.id,
    });

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newTransaction);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Transaction created successfully.");
  });

  const testTemplate = async (
    newData: Partial<TransactionTest>,
    errorMessage: string
  ) => {
    const transaction = generateTransaction({
      ...newData,
      user_id: user.id,
      category_id: category.id,
    });

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(transaction);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(errorMessage);
  };

  test("Insert a transaction without a amount", () =>
    testTemplate({ amount: null }, "Amount is required."));
  test("Insert a transaction without a type", () =>
    testTemplate({ type: null }, "Type is required."));
  test("Insert a transaction without a payment method", () =>
    testTemplate({ payment_method: null }, "Payment method is required."));
  test("Insert a transaction without a date", () =>
    testTemplate({ date: null }, "Date is required."));
});
