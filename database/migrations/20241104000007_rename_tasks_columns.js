export const up = async (knex) => {
  // Check if columns exist in camelCase format and rename them to snake_case
  const hasStatusId = await knex.schema.hasColumn('tasks', 'statusId');
  const hasCreatorId = await knex.schema.hasColumn('tasks', 'creatorId');
  const hasExecutorId = await knex.schema.hasColumn('tasks', 'executorId');
  const hasCreatedAt = await knex.schema.hasColumn('tasks', 'createdAt');
  const hasUpdatedAt = await knex.schema.hasColumn('tasks', 'updatedAt');

  if (hasStatusId) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('statusId', 'status_id');
    });
  }

  if (hasCreatorId) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('creatorId', 'creator_id');
    });
  }

  if (hasExecutorId) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('executorId', 'executor_id');
    });
  }

  if (hasCreatedAt) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('createdAt', 'created_at');
    });
  }

  if (hasUpdatedAt) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('updatedAt', 'updated_at');
    });
  }

  // Rename columns in task_labels table
  const hasTaskId = await knex.schema.hasColumn('task_labels', 'taskId');
  const hasLabelId = await knex.schema.hasColumn('task_labels', 'labelId');
  const hasTaskLabelsCreatedAt = await knex.schema.hasColumn('task_labels', 'createdAt');
  const hasTaskLabelsUpdatedAt = await knex.schema.hasColumn('task_labels', 'updatedAt');

  if (hasTaskId) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('taskId', 'task_id');
    });
  }

  if (hasLabelId) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('labelId', 'label_id');
    });
  }

  if (hasTaskLabelsCreatedAt) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('createdAt', 'created_at');
    });
  }

  if (hasTaskLabelsUpdatedAt) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('updatedAt', 'updated_at');
    });
  }
};

export const down = async (knex) => {
  // Reverse the renaming for tasks
  const hasStatusId = await knex.schema.hasColumn('tasks', 'status_id');
  const hasCreatorId = await knex.schema.hasColumn('tasks', 'creator_id');
  const hasExecutorId = await knex.schema.hasColumn('tasks', 'executor_id');
  const hasCreatedAt = await knex.schema.hasColumn('tasks', 'created_at');
  const hasUpdatedAt = await knex.schema.hasColumn('tasks', 'updated_at');

  if (hasStatusId) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('status_id', 'statusId');
    });
  }

  if (hasCreatorId) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('creator_id', 'creatorId');
    });
  }

  if (hasExecutorId) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('executor_id', 'executorId');
    });
  }

  if (hasCreatedAt) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('created_at', 'createdAt');
    });
  }

  if (hasUpdatedAt) {
    await knex.schema.table('tasks', (table) => {
      table.renameColumn('updated_at', 'updatedAt');
    });
  }

  // Reverse the renaming for task_labels
  const hasTaskId = await knex.schema.hasColumn('task_labels', 'task_id');
  const hasLabelId = await knex.schema.hasColumn('task_labels', 'label_id');
  const hasTaskLabelsCreatedAt = await knex.schema.hasColumn('task_labels', 'created_at');
  const hasTaskLabelsUpdatedAt = await knex.schema.hasColumn('task_labels', 'updated_at');

  if (hasTaskId) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('task_id', 'taskId');
    });
  }

  if (hasLabelId) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('label_id', 'labelId');
    });
  }

  if (hasTaskLabelsCreatedAt) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('created_at', 'createdAt');
    });
  }

  if (hasTaskLabelsUpdatedAt) {
    await knex.schema.table('task_labels', (table) => {
      table.renameColumn('updated_at', 'updatedAt');
    });
  }
};

