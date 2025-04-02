import db from "../config/db.js";
import { Report } from "../models/report.model.js";

export class ReportRepository {
  async getAll(): Promise<Report[]> {
    return db<Report>("reports").select("*");
  }

  async getById(id: string): Promise<Report | null> {
    const report = await db<Report>("reports").where({ id }).first();

    return report ?? null;
  }

  async getByUserId(userId: string): Promise<Report[]> {
    const reports = await db<Report>("reports")
      .where({ user_id: userId })
      .select("*");

    return reports;
  }

  async save(report: Omit<Report, "id">): Promise<Report> {
    const [newReport] = await db<Report>("reports")
      .insert({ ...report })
      .returning("*");

    return newReport;
  }

  async update(id: string, report: Partial<Report>): Promise<Report | null> {
    const [updatedReport] = await db<Report>("reports")
      .where({ id })
      .update({ ...report })
      .returning("*");

    return updatedReport;
  }

  async delete(id: string): Promise<number> {
    return db("reports").where({ id }).del();
  }
}
