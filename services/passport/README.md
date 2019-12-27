# Auth Service

Сервис авторизации на passport.js, knex и objection. Подключается к PostgreSQL.

### Install

```bash
npm i kinovert-service-passport

# Create .env file
echo 'DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>' >> .env

# Apply migrations
node ./node_modules/kinovert-serivce-passport/.bin/migrate

# Then simply start your app
touch server.js
```

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

authService.listen(8080);
```

## Usage

### Signup/Login

После того как мы запустили локальный сервис, можно сделать обращение к `/signup` API следующим образом:

```bash
curl -H "Content-Type: application/json" \
     -d'{"username": "test123", "email: "test@user.ru", "password": "test123", "confirmPassword": "test123"}' \
     http://localhost:8080/signup
```

На валидный запрос, вы получите ответ:

```json
{
  "id": 1,
  "username": "test123",
  "email": "test@user.ru",
  "token": "4ffd5ee92853787836325dcea74c02e4"
}
```

После чего можно дернуть ручку `/login` чтобы получить его токен,

```bash
curl -H "Content-Type: application/json" \
     -d'{"email": "test@user.ru", "password": "test123"}' \
     http://localhost:8080/login
```

### Webhook для GraphQL Engine

Авторизационный webhook который можно быть сконфигурирован для Hasura GraphQL Engine (`HASURA_GRAPHQL_AUTH_HOOK`) доступен на ручке `/webhook`. Он получает Authorization bearer токен для валидации юзера. Клиенту только нужно отправлять `Authorization: Bearer <token>` в запросе к GraphQL Engine.

[Больше читайте здесь](https://docs.hasura.io/1.0/graphql/manual/auth/authentication/webhook.html).
