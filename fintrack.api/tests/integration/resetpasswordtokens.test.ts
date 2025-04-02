import supertest, { Response } from "supertest";
import app from "../../src/app";
import { generateChangePassword } from "../utils/resetPasswordFactory";
import { UserTest, generateUser } from "../utils/userFactory";

const route = "/reset-password";
const sendEmailRoute = "send-email";
const changePasswordRoute = "change-password";

let user: UserTest;

beforeAll(async () => {
  user = generateUser();

  const userResponse: Response = await supertest(app)
    .post("/auth/signup")
    .send(user);

  expect(userResponse.status).toBe(201);

  user = userResponse.body;
});

describe("Reset Password Tests", () => {
  test("Should send a email to reset password when user exists", async () => {
    const response: Response = await supertest(app)
      .post(`${route}/${sendEmailRoute}`)
      .send({
        email: user.email,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email sent successfully.");
  });

  test("Should return success even if the user does not exist", async () => {
    const response: Response = await supertest(app)
      .post(`${route}/${sendEmailRoute}`)
      .send({
        email: "nonexistentuser@example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email sent successfully.");
  });

  test("Should change password when user put valid credentials", async () => {
    const validToken = "validtoken456";

    await app.db("resetpasswordtokens").insert({
      token: validToken,
      expirydate: new Date(Date.now() + 3600000),
      user_id: user.id,
    });

    const changePassword = generateChangePassword();

    const response: Response = await supertest(app)
      .put(`${route}/${changePasswordRoute}`)
      .send(changePassword);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password changed successfully.");
  });

  test("Should return error message when user passwords are mismatched", async () => {
    const validToken = "validtoken123";

    await app.db("resetpasswordtokens").insert({
      token: validToken,
      expirydate: new Date(Date.now() + 3600000),
      user_id: user.id,
    });

    const changePassword = generateChangePassword({
      confirmNewPassword: "Invalid@Password-12",
    });

    const response: Response = await supertest(app)
      .put(`${route}/${changePasswordRoute}`)
      .send(changePassword);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Passwords do not match.");
  });

  test("Should return error message when token is expired", async () => {
    const expiredToken = "expiredtoken123";

    await app.db("resetpasswordtokens").insert({
      token: expiredToken,
      expirydate: new Date(Date.now() - 3600000),
      user_id: user.id,
    });

    const changePassword = generateChangePassword();

    const response: Response = await supertest(app)
      .put(`${route}/${changePasswordRoute}`)
      .send(changePassword);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid or expired token.");
  });

  test("Should return error message when token is invalid", async () => {
    const changePassword = generateChangePassword();

    const response: Response = await supertest(app)
      .put(`${route}/${changePasswordRoute}`)
      .send(changePassword);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid or expired token.");
  });
});
