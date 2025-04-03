import { ISendEmail } from "@/types/resetPassword";
import apiRequest from "./helpers/api.service";

const route = "reset-password";

export const SendEmail = async (email: ISendEmail) =>
  apiRequest("POST", `${route}/send-email`, email, false);
