import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("transactions", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.decimal("amount", 10, 2).notNullable();
    t.string("type", 10).notNullable();
    t.string("payment_method", 20).defaultTo("cash").notNullable();
    t.timestamp("date").defaultTo(knex.fn.now()).notNullable();
    t.text("note").nullable();

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

  await knex.raw(`
    ALTER TABLE transactions 
    ADD CONSTRAINT check_type 
    CHECK (type IN ('income', 'expense'))
  `);

  await knex.raw(`
    ALTER TABLE transactions 
    ADD CONSTRAINT check_payment_method 
    CHECK (payment_method IN ('cash', 'credit', 'debit', 'mbway'))
  `);
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
