import supertest, { Response } from "supertest";
import { v4 } from "uuid";
import app from "../../src/app";
import { BudgetTest, generateBudget } from "../utils/budgetFactory";
import { generateCategory } from "../utils/categoryFactory";
import { createAndAuthenticateUser } from "../utils/test-helper";

const route = "/budgets";

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

describe("Budget Tests", () => {
  test("Should return all budgets", async () => {
    const res: Response = await supertest(app)
      .get(route)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return a budget by ID", async () => {
    const budget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const createBudgetRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(budget);

    expect(createBudgetRes.status).toBe(201);

    const createdBudget = createBudgetRes.body;

    const res: Response = await supertest(app)
      .get(`${route}/${createdBudget.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return not found message when budget does not exist", async () => {
    const res: Response = await supertest(app)
      .get(`${route}/${v4()}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Budget not found.");
  });

  test("Should return all budgets when user ID is valid", async () => {
    const budget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const createBudgetRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(budget);

    expect(createBudgetRes.status).toBe(201);

    const res: Response = await supertest(app)
      .get(`${route}/by-user/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return all budgets when category ID is valid", async () => {
    const budget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const createBudgetRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(budget);

    expect(createBudgetRes.status).toBe(201);

    const res: Response = await supertest(app)
      .get(`${route}/by-category/${category.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should create a new budget sucessfully", async () => {
    const newBudget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newBudget);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Budget created successfully.");
  });

  const testTemplate = async (
    newData: Partial<BudgetTest>,
    errorMessage: string
  ) => {
    const budget = generateBudget({
      ...newData,
      user_id: user.id,
      category_id: category.id,
    });

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(budget);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(errorMessage);
  };

  test("Insert a budget without a limit amount", () =>
    testTemplate({ limit_amount: null }, "Limit amount is required."));
  test("Insert a budget without a start date", () =>
    testTemplate({ start_date: null }, "Start date is required."));
  test("Insert a budget without a end date", () =>
    testTemplate({ end_date: null }, "End date is required."));

  test("Should update a budget successfully", async () => {
    const newBudget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const createBudgetRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newBudget);

    expect(createBudgetRes.status).toBe(201);

    const createdBudget = createBudgetRes.body;

    const updatedBudget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const res: Response = await supertest(app)
      .put(`${route}/${createdBudget.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(updatedBudget);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Budget updated successfully.");
  });

  test("Should delete a budget by ID", async () => {
    const budget = generateBudget({
      user_id: user.id,
      category_id: category.id,
    });

    const createBudgetRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(budget);

    expect(createBudgetRes.status).toBe(201);

    const createdBudget = createBudgetRes.body;

    const res: Response = await supertest(app)
      .delete(`${route}/${createdBudget.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(204);
  });
});
