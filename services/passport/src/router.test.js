const request = require('supertest');
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
  it('Ошибка неправильного ввода данных при регистрации', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'test@mailcom',
        username: 'test',
        password: 'test is cool',
        confirmPassword: 'test is cool',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
  it('Ошибка неправильного ввода данных ', async () => {
    const res = await request(app)
      .get('/webhook')
      .send({
        email: 'test@mail.com',
        password: 'test is cool',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('X-Hasura-Role');
  });
});
