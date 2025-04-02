import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { Report } from "../models/report.model.js";
import { ReportRepository } from "../repositories/report.repository.js";

export class ReportService {
  private reportRepository = new ReportRepository();

  async getAll(): Promise<Report[]> {
    return this.reportRepository.getAll();
  }

  async getById(id: string): Promise<Report> {
    const report = await this.reportRepository.getById(id);

    if (!report) throw new NotFoundError("Report not found.");

    return report;
  }

  async getByUserId(userId: string): Promise<Report[]> {
    return this.reportRepository.getByUserId(userId);
  }

  async save(report: Report): Promise<Report> {
    if (!report.file_url) throw new ValidationError("File URL is required.");
    if (!report.generated_at)
      throw new ValidationError("Generated date is required.");

    return await this.reportRepository.save(report);
  }

  async update(id: string, updates: Partial<Report>): Promise<Report | null> {
    const report = await this.reportRepository.getById(id);

    if (!report) throw new NotFoundError("Report not found.");

    return this.reportRepository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    const report = await this.reportRepository.getById(id);

    if (!report) throw new NotFoundError("Report not found.");

    await this.reportRepository.delete(id);
  }
}
