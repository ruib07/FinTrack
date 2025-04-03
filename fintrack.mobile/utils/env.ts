export const getAPIUrl = (): string => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

  if (!API_BASE_URL) console.warn("API URL is not defined in .env");

  return `${API_BASE_URL}`;
};
