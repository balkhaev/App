const { Model } = require('objection');
const Knex = require('knex');

const connection = require('../../knexfile');

Model.knex(Knex(connection));

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'id';
  }

  getRole() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }
}

module.exports = Role;
