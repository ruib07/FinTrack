import supertest, { Response } from "supertest";
import { v4 } from "uuid";
import app from "../../src/app";
import { CategoryTest, generateCategory } from "../utils/categoryFactory";
import { createAndAuthenticateUser } from "../utils/test-helper";

const route = "/categories";

let user: any;

beforeAll(async () => {
  user = await createAndAuthenticateUser();
});

describe("Category Tests", () => {
  test("Should return all categories", async () => {
    const res: Response = await supertest(app)
      .get(route)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return a category by ID", async () => {
    const category = generateCategory();

    const createCategoryRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(category);

    expect(createCategoryRes.status).toBe(201);

    const createdCategory = createCategoryRes.body;

    const res: Response = await supertest(app)
      .get(`${route}/${createdCategory.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return not found message when category does not exist", async () => {
    const res: Response = await supertest(app)
      .get(`${route}/${v4()}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Category not found.");
  });

  test("Should create a new category successfully", async () => {
    const newCategory = generateCategory();

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newCategory);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Category created successfully.");
    expect(res.body).toHaveProperty("id");
  });

  const testTemplate = async (
    newData: Partial<CategoryTest>,
    errorMessage: string
  ) => {
    const category = generateCategory(newData);

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(category);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(errorMessage);
  };

  test("Insert a category without a name", () =>
    testTemplate({ name: null }, "Name is required."));
  test("Insert a category without a type", () =>
    testTemplate({ type: null }, "Type is required."));

  test("Should update a category successfully", async () => {
    const newCategory = generateCategory();

    const createCategoryRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newCategory);

    expect(createCategoryRes.status).toBe(201);

    const createdCategory = createCategoryRes.body;

    const updatedCategory = generateCategory();

    const res: Response = await supertest(app)
      .put(`${route}/${createdCategory.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(updatedCategory);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category updated successfully.");
  });

  test("Should delete a category by ID", async () => {
    const category = generateCategory();

    const createCategoryRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(category);

    expect(createCategoryRes.status).toBe(201);

    const createdCategory = createCategoryRes.body;

    const res: Response = await supertest(app)
      .delete(`${route}/${createdCategory.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(204);
  });
});
