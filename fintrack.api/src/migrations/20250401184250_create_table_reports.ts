import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("reports", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.text("file_url").notNullable();
    t.timestamp("generated_at").defaultTo(knex.fn.now()).notNullable();

    t.uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("reports");
}
