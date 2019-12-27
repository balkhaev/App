# Auth Service

Сервис авторизации на express, passport.js, knex и objection. Подключается к PostgreSQL. Имеет 3 ручки - `/login`, `/signup`, `/webhook`.

### Install

```bash
npm i kinovert-service-passport

echo 'DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>' >> .env

# Apply migrations
node ./node_modules/kinovert-serivce-passport/.bin/migrate

touch server.js
```

`server.js`
```javascript
// authService = express app
const authService = require('kinovert-service-passport');

authService.setup({
  beforeLogin(req, next) {
    if (req.params.isDebug === 'true') {
      console.log(req);
    }

    next();
  },
  afterLogin(req, user, next) {},

  beforeSignup(req, next) {},
  afterSignup(req, user, next) {},

  onWebhook(req, next) {},
});

authService.listen(5005, () => {
  console.log('Auth service at http://localhost:5005');
});
```

## Usage

### Signup

При запросе ручке `/signup` происходит валидация входящих данных и objection запрос в бд. Если дернуть ее следующим образом:

```bash
curl -H "Content-Type: application/json" \
     -d'{"username": "test123", "email: "test@user.ru", "password": "test123", "confirmPassword": "test123"}' \
     http://localhost:8080/signup
```

Вы должны получить ответ:

```json
{
  "id": 1,
  "username": "test123",
  "email": "test@user.ru",
  "token": "4ffd5ee92853787836325dcea74c02e4"
}
```

### Login

Валидирует входящий JSON и производит аутентификацию. Если дернуть ручку так:

```bash
curl -H "Content-Type: application/json" \
     -d'{"email": "test@user.ru", "password": "test123"}' \
     http://localhost:8080/login
```

То получите тот же ответ, что и при `/signup` запросе.

### Webhook для GraphQL Engine

Авторизационный webhook который можно быть сконфигурирован для Hasura GraphQL Engine (`HASURA_GRAPHQL_AUTH_HOOK`) доступен на ручке `/webhook`. Он получает Authorization bearer токен для валидации юзера. Клиенту только нужно отправлять `Authorization: Bearer <token>` в запросе к GraphQL Engine.

[Больше читайте здесь](https://docs.hasura.io/1.0/graphql/manual/auth/authentication/webhook.html).
