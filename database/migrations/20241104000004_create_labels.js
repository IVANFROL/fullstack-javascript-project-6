export const up = (knex) => {
  return knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
};

export const down = (knex) => {
  return knex.schema.dropTableIfExists('labels');
};
