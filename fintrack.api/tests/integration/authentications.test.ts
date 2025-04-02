import supertest, { Response } from "supertest";
import app from "../../src/app";
import { generateUser, UserTest } from "../utils/userFactory";

const route = "/auth";
const signinRoute = "signin";
const signupRoute = "signup";

describe("Authentication Tests", () => {
  test("Should create a new user successfully", async () => {
    const newUser = generateUser();

    const res: Response = await supertest(app)
      .post(`${route}/${signupRoute}`)
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  const testTemplate = async (
    newData: Partial<UserTest>,
    errorMessage: string
  ) => {
    const user = generateUser(newData);

    const res: Response = await supertest(app)
      .post(`${route}/${signupRoute}`)
      .send(user);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(errorMessage);
  };

  test("Insert a user without a name", () =>
    testTemplate({ name: null }, "Name is required."));
  test("Insert a user without a email", () =>
    testTemplate({ email: null }, "Email is required."));
  test("Insert a user without a password", () =>
    testTemplate({ password: null }, "Password is required."));
  test("Insert a user without a currency", () =>
    testTemplate({ currency: null }, "Currency is required."));

  test("Should return a token when the user authenticates successfully", async () => {
    const user = generateUser();

    const signupRes: Response = await supertest(app)
      .post(`${route}/${signupRoute}`)
      .send(user);

    expect(signupRes.status).toBe(201);

    const signinRes: Response = await supertest(app)
      .post(`${route}/${signinRoute}`)
      .send({
        email: user.email,
        password: user.password,
      });

    expect(signinRes.status).toBe(200);
    expect(signinRes.body).toHaveProperty("token");
    expect(signinRes.body).toHaveProperty("user");
  });

  test("Should fail authentication when the user puts invalid credentials", async () => {
    const user = generateUser();

    const signupRes: Response = await supertest(app)
      .post(`${route}/${signupRoute}`)
      .send(user);

    expect(signupRes.status).toBe(201);

    const signinRes: Response = await supertest(app)
      .post(`${route}/${signinRoute}`)
      .send({
        email: user.email,
        password: "Invalid@Password-123",
      });

    expect(signinRes.status).toBe(400);
    expect(signinRes.body.message).toBe("Invalid authentication.");
  });
});
