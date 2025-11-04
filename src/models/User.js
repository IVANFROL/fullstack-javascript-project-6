import { Model } from 'objection';
import bcrypt from 'bcrypt';

export default class User extends Model {
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
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  async $beforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async $beforeUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static get jsonAttributes() {
    return ['firstName', 'lastName', 'email'];
  }
}
