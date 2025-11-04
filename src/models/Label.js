import { Model } from 'objection';
import Task from './Task.js';

export default class Label extends Model {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: Model.ManyToManyRelation,
        modelClass: Task,
        join: {
          from: 'labels.id',
          through: {
            from: 'task_labels.labelId',
            to: 'task_labels.taskId',
          },
          to: 'tasks.id',
        },
      },
    };
  }


}
