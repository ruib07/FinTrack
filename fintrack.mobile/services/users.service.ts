import { IUser } from "@/types/user";
import apiRequest from "./helpers/api.service";

const route = "users";

export const GetUserById = async (userId: string) =>
  apiRequest("GET", `${route}/${userId}`, undefined, true);

export const UpdateUser = async (userId: string, updateUser: Partial<IUser>) =>
  apiRequest("PUT", `${route}/${userId}`, updateUser, true);

export const DeleteUser = async (userId: string) =>
  apiRequest("DELETE", `${route}/${userId}`, undefined, true);
