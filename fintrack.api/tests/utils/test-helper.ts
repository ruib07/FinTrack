import supertest, { Response } from "supertest";
import app from "../../src/app";
import { generateUser } from "./userFactory";

const signupRoute = "/auth/signup";
const signinRoute = "/auth/signin";

export const createAndAuthenticateUser = async () => {
  const userRegistration = generateUser();

  const signupRes: Response = await supertest(app)
    .post(signupRoute)
    .send(userRegistration);

  const createdUser = signupRes.body;

  const signinRes: Response = await supertest(app).post(signinRoute).send({
    email: userRegistration.email,
    password: userRegistration.password,
  });

  return { ...createdUser, token: signinRes.body.token };
};
