const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer', minimum: 1 },
        executorId: { type: ['integer', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }


  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);

    const converted = {
      ...json,
      ...(json.id !== undefined && { id: parseInt(json.id, 10) }),
      statusId: parseInt(json.statusId, 10),
      creatorId: parseInt(json.creatorId, 10),
      executorId: parseInt(json.executorId, 10) || null,
    };

    return converted;
  }

  static modifiers = {
    async filter(query, filterParams = {}) {
      const { status, executor, label, creator } = filterParams;
      const isProduction = process.env.NODE_ENV === 'production';
      const statusIdCol = isProduction ? 'status_id' : 'statusId';
      const executorIdCol = isProduction ? 'executor_id' : 'executorId';
      const creatorIdCol = isProduction ? 'creator_id' : 'creatorId';

      query
        .skipUndefined()
        .where(statusIdCol, status || undefined)
        .andWhere(executorIdCol, executor || undefined)
        .andWhere('labels.id', label || undefined)
        .andWhere(creatorIdCol, creator || undefined);
    },
  };

  static get relationMappings() {
    const isProduction = process.env.NODE_ENV === 'production';
    const statusIdCol = isProduction ? 'status_id' : 'statusId';
    const executorIdCol = isProduction ? 'executor_id' : 'executorId';
    const creatorIdCol = isProduction ? 'creator_id' : 'creatorId';
    const taskIdCol = isProduction ? 'task_id' : 'taskId';
    const labelIdCol = isProduction ? 'label_id' : 'labelId';

    return {
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User.cjs',
        join: {
          from: `tasks.${creatorIdCol}`,
          to: 'users.id',
        },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User.cjs',
        join: {
          from: `tasks.${executorIdCol}`,
          to: 'users.id',
        },
      },
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Status.cjs',
        join: {
          from: `tasks.${statusIdCol}`,
          to: 'statuses.id',
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Label.cjs',
        join: {
          from: 'tasks.id',
          through: {
            from: `task_labels.${taskIdCol}`,
            to: `task_labels.${labelIdCol}`,
          },
          to: 'labels.id',
        },
      },
    };
  }
};
