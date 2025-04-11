import axios from "axios";
import { ChangePassword } from "../types/changePassword";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UpdatePassword = async (changePassword: ChangePassword) => {
  try {
    await axios.put(
      `${API_BASE_URL}/reset-password/change-password`,
      changePassword
    );
  } catch {
    throw new Error("Failed to change password.");
  }
};
