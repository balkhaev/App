const request = require('supertest');
const assert = require('assert');

const app = require('./server');

describe('Passport endpoints', () => {
  it('Ошибка неправильного ввода данных при логине', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@mail.com',
        password: 'test is cool',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('Ошибка неправильного ввода данных при регистрации', () => {
    return request(app)
      .get('/signup')
      .send({
        email: 'test@mailcom',
        username: 'test',
        password: 'test is cool',
        confirmPassword: 'test is cool',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .then(res => {
        assert(res.status, false);
      });
  });
  it('Webhook работает корректно', async () => {
    return request(app)
      .get('/webhook/hasura')
      .set('Authorization', '57bf0509820a52075214b2da8d1ff1c2')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res).toHaveProperty('X-Hasura-User-Company-Id');
        expect(res).toHaveProperty('X-Hasura-User-Id');
        expect(res).toHaveProperty('X-Hasura-Role');
      });
  });
});
