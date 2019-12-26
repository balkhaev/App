const { promisify } = require('util');
const Knex = require('knex');
const connection = require('../../knexfile');
const { Model } = require('objection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
      token: this.token,
      email: this.email,
      role: role.name,
    };
  }

  async $beforeInsert() {
    const salt = bcrypt.genSaltSync();
    this.password = await bcrypt.hash(this.password, salt);
    const createRandomToken = await randomBytesAsync(16).then(buf => buf.toString('hex'));
    this.token = createRandomToken;
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
        username: { type: 'string', minLength: 1, maxLength: 255 },
        role_id: { type: 'string', minLength: 1, maxLength: 255 },
        token: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    const Role = require('./roleSchema');

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
