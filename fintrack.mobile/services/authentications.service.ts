import { ISignin } from "@/types/authentication";
import { IUser } from "@/types/user";
import apiRequest from "./helpers/api.service";

const route = "auth";

export const Signup = async (newUser: IUser) =>
  apiRequest("POST", `${route}/signup`, newUser, false);

export const Signin = async (signin: ISignin) =>
  apiRequest("POST", `${route}/signin`, signin, false);
