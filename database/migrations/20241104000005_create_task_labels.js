export const up = (knex) => knex.schema.createTable('task_labels', (table) => {
  table.increments('id').primary();
  table.integer('task_id').unsigned().notNullable();
  table.integer('label_id').unsigned().notNullable();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());

  table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
  table.foreign('label_id').references('id').inTable('labels').onDelete('CASCADE');
  table.unique(['task_id', 'label_id']);
});

export const down = (knex) => knex.schema.dropTableIfExists('task_labels');
