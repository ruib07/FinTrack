import supertest, { Response } from "supertest";
import app from "../../src/app";

test("Test if it is resolving at the root", async () => {
  const response: Response = await supertest(app).get("/");

  expect(response.status).toBe(200);
});
