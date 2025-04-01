import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("budgets", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.decimal("limit_amount", 10, 2).notNullable();
    t.date("start_date").notNullable();
    t.date("end_date").notNullable();

    t.uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();

    t.uuid("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE")
      .notNullable();
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("budgets");
}
