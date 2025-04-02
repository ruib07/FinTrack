import supertest, { Response } from "supertest";
import { v4 } from "uuid";
import app from "../../src/app";
import { generateReport, ReportTest } from "../utils/reportFactory";
import { createAndAuthenticateUser } from "../utils/test-helper";

const route = "/reports";

let user: any;

beforeAll(async () => {
  user = await createAndAuthenticateUser();
});

describe("Report Tests", () => {
  test("Should return all reports", async () => {
    const res: Response = await supertest(app)
      .get(route)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return a report by ID", async () => {
    const report = generateReport({
      user_id: user.id,
    });

    const createReportRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(report);

    expect(createReportRes.status).toBe(201);

    const createdReport = createReportRes.body;

    const res: Response = await supertest(app)
      .get(`${route}/${createdReport.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should return not found message when report does not exist", async () => {
    const res: Response = await supertest(app)
      .get(`${route}/${v4()}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Report not found.");
  });

  test("Should return all reports when user ID is valid", async () => {
    const report = generateReport({
      user_id: user.id,
    });

    const createReportRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(report);

    expect(createReportRes.status).toBe(201);

    const res: Response = await supertest(app)
      .get(`${route}/by-user/${user.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(200);
  });

  test("Should create a new report sucessfully", async () => {
    const newReport = generateReport({
      user_id: user.id,
    });

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newReport);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Report created successfully.");
  });

  const testTemplate = async (
    newData: Partial<ReportTest>,
    errorMessage: string
  ) => {
    const report = generateReport({
      ...newData,
      user_id: user.id,
    });

    const res: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(report);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(errorMessage);
  };

  test("Insert a report without a file url", () =>
    testTemplate({ file_url: null }, "File URL is required."));
  test("Insert a report without a generated date", () =>
    testTemplate({ generated_at: null }, "Generated date is required."));

  test("Should update a report successfully", async () => {
    const newReport = generateReport({
      user_id: user.id,
    });

    const createReportRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(newReport);

    expect(createReportRes.status).toBe(201);

    const createdReport = createReportRes.body;

    const updatedReport = generateReport({
      user_id: user.id,
    });

    const res: Response = await supertest(app)
      .put(`${route}/${createdReport.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(updatedReport);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Report updated successfully.");
  });

  test("Should delete a report by ID", async () => {
    const report = generateReport({
      user_id: user.id,
    });

    const createReportRes: Response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(report);

    expect(createReportRes.status).toBe(201);

    const createdReport = createReportRes.body;

    const res: Response = await supertest(app)
      .delete(`${route}/${createdReport.id}`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(204);
  });
});
