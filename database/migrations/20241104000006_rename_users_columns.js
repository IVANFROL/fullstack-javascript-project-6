export const up = async (knex) => {
  // Check if columns exist in camelCase format and rename them to snake_case
  const hasFirstName = await knex.schema.hasColumn('users', 'firstName');
  const hasLastName = await knex.schema.hasColumn('users', 'lastName');
  const hasPassword = await knex.schema.hasColumn('users', 'password');
  const hasCreatedAt = await knex.schema.hasColumn('users', 'createdAt');
  const hasUpdatedAt = await knex.schema.hasColumn('users', 'updatedAt');

  if (hasFirstName) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('firstName', 'first_name');
    });
  }

  if (hasLastName) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('lastName', 'last_name');
    });
  }

  if (hasPassword) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('password', 'password_digest');
    });
  }

  if (hasCreatedAt) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('createdAt', 'created_at');
    });
  }

  if (hasUpdatedAt) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('updatedAt', 'updated_at');
    });
  }
};

export const down = async (knex) => {
  // Reverse the renaming
  const hasFirstName = await knex.schema.hasColumn('users', 'first_name');
  const hasLastName = await knex.schema.hasColumn('users', 'last_name');
  const hasPasswordDigest = await knex.schema.hasColumn('users', 'password_digest');
  const hasCreatedAt = await knex.schema.hasColumn('users', 'created_at');
  const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');

  if (hasFirstName) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('first_name', 'firstName');
    });
  }

  if (hasLastName) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('last_name', 'lastName');
    });
  }

  if (hasPasswordDigest) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('password_digest', 'password');
    });
  }

  if (hasCreatedAt) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('created_at', 'createdAt');
    });
  }

  if (hasUpdatedAt) {
    await knex.schema.table('users', (table) => {
      table.renameColumn('updated_at', 'updatedAt');
    });
  }
};

