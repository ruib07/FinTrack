export interface ReportTest {
  id?: string;
  file_url: string | null;
  generated_at: Date | null;
  user_id: string | null;
}

export const generateReport = (
  overrides: Partial<ReportTest> = {}
): ReportTest => ({
  file_url:
    overrides.file_url !== undefined ? overrides.file_url : "file-url-test",
  generated_at:
    overrides.generated_at !== undefined ? overrides.generated_at : new Date(),
  user_id: overrides.user_id ?? null,
});
