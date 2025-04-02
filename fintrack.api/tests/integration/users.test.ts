import supertest, { Response } from "supertest";
import { v4 } from "uuid";
import app from "../../src/app";
import { createAndAuthenticateUser } from "../utils/test-helper";
import { generateUser } from "../utils/userFactory";

const route = "/users";

let user: any;

beforeAll(async () => {
  user = await createAndAuthenticateUser();
});

describe("User Tests", () => {
  test("Should return all users", async () => {
    const res: Response = await supertest(app)
      .get(route)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return a user by his ID", async () => {
    const res: Response = await supertest(app)
      .get(`${route}/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return not found message when user does not exist", async () => {
    const res: Response = await supertest(app)
      .get(`${route}/${v4()}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });

  test("Should update a user successfully", async () => {
    const updatedUser = generateUser();

    const res: Response = await supertest(app)
      .put(`${route}/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(updatedUser);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully.");
  });

  test("Should delete a user by his ID", async () => {
    const res: Response = await supertest(app)
      .delete(`${route}/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(204);
  });
});
