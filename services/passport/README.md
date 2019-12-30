# Auth Service

Сервис авторизации на express, passport.js, knex и objection. Подключается к PostgreSQL. Имеет 3 ручки - `/login`, `/signup`, `/webhook`.

### Install

```bash
npm i bb-auth-service

echo 'DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>' >> .env

# Apply migrations
node ./node_modules/bb-auth-service/.bin/migrate

touch server.js
```

`server.js`
```javascript
// authService = express app
const authService = require('bb-auth-service');

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
  "role": "user",
  "email": "test@user.ru",
  "username": "test123",
  "token": "4ffd5ee92853787836325dcea74c02e4",
  "company_id": "bf4b3d61-fbc6-4e23-9089-bd825f1e2fcd"
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


## My dream

```
Xiaomi@DESKTOP-71VBJM8 MINGW64 /c/code (master)
$ npx bb-auth-service init auth-service --callback http://localhost:4000/api/callback/auth
...
$ cd auth-service
$ npm run dev
[auth-service] 2019/12/30 00:27:12 Using 'postgresq://user@****:host/db' from .env file as database for storage.
[auth-service] 2019/12/30 00:27:12 Using 'http://localhost:4000/api/callback/auth' as the endpoint for hooks
[auth-service] 2019/12/30 00:27:12 Enabled hook events: pre-login, post-login, pre-signin, post-signin
[auth-service] 2019/12/30 00:27:12 Using 0.0.0.0:6767 as address to listen.
[auth-service] 2019/12/30 00:27:12 Using /auth as the base path.
[auth-service] 2019/12/30 00:27:12 Using /metrics as the metrics path.
[auth-service] 2019/12/30 00:27:12 You can now:
[auth-service] 2019/12/30 00:27:12 login users: http://0.0.0.0:6767/auth/login
[auth-service] 2019/12/30 00:27:12 sign in users: http://0.0.0.0:6767/auth/signin
[auth-service] 2019/12/30 00:27:12 And webhook for services: http://0.0.0.0:6767/auth/webhook
```
