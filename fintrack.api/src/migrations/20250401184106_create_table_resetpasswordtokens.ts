import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("resetpasswordtokens", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("token").notNullable();
    t.datetime("expirydate").notNullable();

    t.uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("resetpasswordtokens");
}
