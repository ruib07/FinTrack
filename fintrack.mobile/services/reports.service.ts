import { IReport } from "@/types/report";
import apiRequest from "./helpers/api.service";

const route = "reports";

export const GetReports = async () => apiRequest("GET", route, undefined, true);

export const GetReportByID = async (reportId: string) =>
  apiRequest("GET", `${route}/${reportId}`, undefined, true);

export const GetReportsByUser = async (userId: string) =>
  apiRequest("GET", `${route}/by-user/${userId}`, undefined, true);

export const CreateReport = async (newReport: IReport) =>
  apiRequest("POST", route, newReport, true);

export const UpdateReport = async (
  reportId: string,
  updateReport: Partial<IReport>
) => apiRequest("PUT", `${route}/${reportId}`, updateReport, true);

export const DeleteReport = async (reportId: string) =>
  apiRequest("DELETE", `${route}/${reportId}`, undefined, true);
