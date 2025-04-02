import { Request, Response } from "express";
import { Report } from "../models/report.model.js";
import { ReportService } from "../services/report.service.js";

export class ReportsController {
  static async getAll(req: Request, res: Response) {
    res.send(await new ReportService().getAll());
  }

  static async getById(req: Request, res: Response) {
    let reportId = req.params.id;

    res.send(await new ReportService().getById(reportId));
  }

  static async getByUserId(req: Request, res: Response) {
    let userId = req.params.userId;

    res.send(await new ReportService().getByUserId(userId));
  }

  static async create(req: Request, res: Response) {
    const report = req.body as Report;

    const createdReport = await new ReportService().save(report);

    res.status(201).send({
      message: "Report created successfully!",
      id: createdReport.id,
    });
  }

  static async update(req: Request, res: Response) {
    let reportId = req.params.id;
    let report = req.body as Report;

    await new ReportService().update(reportId, report);

    res.send({
      message: "Report updated successfully.",
    });
  }

  static async delete(req: Request, res: Response) {
    let reportId = req.params.id;

    await new ReportService().delete(reportId);
    res.status(204).end();
  }
}
