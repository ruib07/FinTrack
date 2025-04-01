import { Knex } from "knex";

declare global {
  namespace Express {
    export interface Application {
      db: Knex;
    }
  }
}
