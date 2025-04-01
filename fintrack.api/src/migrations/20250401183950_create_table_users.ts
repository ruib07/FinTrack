import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("name", 100).notNullable();
    t.string("email", 100).unique().notNullable();
    t.string("password", 100).notNullable();
    t.string("currency", 4).defaultTo("EUR").notNullable();
    t.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
