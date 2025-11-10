const objectionUnique = require('objection-unique');

const BaseModel = require('./BaseModel.cjs');
const hashPassword = require('../lib/secure.cjs');

const unique = objectionUnique({ fields: ['email'] });

module.exports = class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 3 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }


  static relationMappings = {
    createdTasks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Task.cjs',
      join: {
        from: 'users.id',
        to: 'tasks.creatorId',
      },
    },
    assignedTasks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Task.cjs',
      join: {
        from: 'users.id',
        to: 'tasks.executorId',
      },
    },
  };

  static modifiers = {
    getFullName(query) {
      const { raw } = User;
      const isProduction = process.env.NODE_ENV === 'production';
      const firstNameCol = isProduction ? 'first_name' : 'firstName';
      const lastNameCol = isProduction ? 'last_name' : 'lastName';
      query.select(
        'id',
        raw("CONCAT(??, ' ', ??)", [firstNameCol, lastNameCol]).as('fullName')
      );
    },

    getPublicDate(query) {
      const { raw } = User;
      const isProduction = process.env.NODE_ENV === 'production';
      const firstNameCol = isProduction ? 'first_name' : 'firstName';
      const lastNameCol = isProduction ? 'last_name' : 'lastName';
      const createdAtCol = isProduction ? 'created_at' : 'createdAt';
      query.select(
        'id',
        raw("CONCAT(??, ' ', ??)", [firstNameCol, lastNameCol]).as('fullName'),
        'email',
        createdAtCol
      );
    },
  };

  set password(value) {
    this.passwordDigest = hashPassword(value);
  }

  verifyPassword(password) {
    return hashPassword(password) === this.passwordDigest;
  }
};
