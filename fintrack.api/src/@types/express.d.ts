import { Knex } from "knex";
import { User } from "../models/user.model.js";

declare global {
  namespace Express {
    export interface Application {
      db: Knex;
    }
    export interface Request {
      user: User;
    }
  }
}
