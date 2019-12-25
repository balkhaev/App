# Kinovert

Вертикализированный онлайн кинотеатр.

## Backend

Проксирует запросы от фронтенда к сервисам.

### Admin

Кастомизированный React-admin с подключенным ra-datasource-hasura.

## Frontend

Next.js приложение с Material.io и Apollo клиентом.

## Services

### Passport

Сервис авторизации, содержит 3 ручки:
- POST **/login** - валидирует данные и передает их passport.js
- POST **/signup** - валидирует данные и с помощью Knex запроса создает их в PostgreSQL
```
- Почему не через Hasura? Зачем дублировать схему?
- Это хороший паттерн и возможность легко отказаться от необкатанной Hasura.
```
- GET **/webhook** - *in progress...*
