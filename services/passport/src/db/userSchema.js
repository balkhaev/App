const { promisify } = require('util');
const { Model } = require('objection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Knex = require('knex');

const connection = require('../../knexfile');
const Role = require('./roleSchema');

const knexConnection = Knex(connection);
const randomBytesAsync = promisify(crypto.randomBytes);

Model.knex(knexConnection);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  async getUser() {
    const role = await this.$relatedQuery('role');

    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: role.name,
      company_id: this.company_id,
      token: this.token,
    };
  }

  async $beforeInsert() {
    // Crypt password
    const salt = bcrypt.genSaltSync();

    this.password = await bcrypt.hash(this.password, salt);
    this.token = await randomBytesAsync(16).then(buf => buf.toString('hex'));

    // Setting user role
    if (!this.role_id) {
      const role = await Role.query().findOne({ name: 'user' });

      this.role_id = role.id;
    }
  }

  verifyPassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email'],
      properties: {
        id: { type: 'integer' },
        company_id: { type: 'string' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        role_id: { type: 'string', minLength: 1, maxLength: 255 },
        token: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'roles.id',
        },
      },
    };
  }
}

module.exports = User;
