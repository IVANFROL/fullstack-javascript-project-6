const renameColumnIfExists = async (knex, tableName, oldName, newName) => {
  const exists = await knex.schema.hasColumn(tableName, oldName);
  if (exists) {
    await knex.schema.table(tableName, (table) => {
      table.renameColumn(oldName, newName);
    });
  }
};

export const up = async (knex) => {
  // Rename columns in tasks table
  await renameColumnIfExists(knex, 'tasks', 'statusId', 'status_id');
  await renameColumnIfExists(knex, 'tasks', 'creatorId', 'creator_id');
  await renameColumnIfExists(knex, 'tasks', 'executorId', 'executor_id');
  await renameColumnIfExists(knex, 'tasks', 'createdAt', 'created_at');
  await renameColumnIfExists(knex, 'tasks', 'updatedAt', 'updated_at');

  // Rename columns in task_labels table
  await renameColumnIfExists(knex, 'task_labels', 'taskId', 'task_id');
  await renameColumnIfExists(knex, 'task_labels', 'labelId', 'label_id');
  await renameColumnIfExists(knex, 'task_labels', 'createdAt', 'created_at');
  await renameColumnIfExists(knex, 'task_labels', 'updatedAt', 'updated_at');
};

export const down = async (knex) => {
  // Reverse the renaming for tasks
  await renameColumnIfExists(knex, 'tasks', 'status_id', 'statusId');
  await renameColumnIfExists(knex, 'tasks', 'creator_id', 'creatorId');
  await renameColumnIfExists(knex, 'tasks', 'executor_id', 'executorId');
  await renameColumnIfExists(knex, 'tasks', 'created_at', 'createdAt');
  await renameColumnIfExists(knex, 'tasks', 'updated_at', 'updatedAt');

  // Reverse the renaming for task_labels
  await renameColumnIfExists(knex, 'task_labels', 'task_id', 'taskId');
  await renameColumnIfExists(knex, 'task_labels', 'label_id', 'labelId');
  await renameColumnIfExists(knex, 'task_labels', 'created_at', 'createdAt');
  await renameColumnIfExists(knex, 'task_labels', 'updated_at', 'updatedAt');
};
