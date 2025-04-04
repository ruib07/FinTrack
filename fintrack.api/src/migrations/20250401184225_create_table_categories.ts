import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("categories", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("name", 50).unique().notNullable();
    t.string("type", 10).notNullable();
    t.text("icon").nullable();

    t.uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
  });

  await knex.raw(`
    ALTER TABLE categories 
    ADD CONSTRAINT check_type 
    CHECK (type IN ('income', 'expense'))
  `);
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("categories");
}
