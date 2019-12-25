# Kinovert

Вертикализированный онлайн кинотеатр.

> В текущий момент все .env.example файлы хранят продакшн данные. Возможно в будующие нужно будет потереть историю коммитов :)

## Ecosystem

В `ecosystem.config.js` помимо прочего содержится конфигурация портов и env перменных содержащих endpoint'ы сервисов. Все важные env перменные содержатся в заигноренных `.env` файлах. `install.sh` для установки всего приложений как монолита.

### Symver
- Все сервисы, бекенд и фронтенд версируются по SymVer начиная с 0.0.0 версии.
- 0.1.0 должна стать первой MVP версией в который уже не стоит вносить мажорных изменений.
- 1.0.0 соответственно production-ready.

## Backend

Проксирует запросы от фронтенда к сервисам. В текущий момент имеет следующие ручки:
- POST **/api/login** - проксирует запрос в Passport Service
- POST **/api/signup** - проксирует запрос в Passport Service
- GET **/api/webhook** - проксирует запрос в Passport Service

In progress:
- POST **/api/upload** - проксирует запрос в Uploader Service
- GET **/api/video/{{videoId}}** - проксирует запрос в Cinematic Service

### Admin

Кастомизированный React-admin с подключенным ra-datasource-hasura.

> - Почему Admin в Backend?
> - В текущий момент Backend знает об Admin, т.к. отдает его статичные файлы. Возможно потом это изменится...

## Frontend

Next.js приложение с Material.io и Apollo клиентом подключенным к Hasura GraphQL Engine.

> - Как происходят авторизированные GraphQL запросы от клиента в Hasura?
> - Каждый запрос уходит напрямую в Hasura, она перед его обработкой дергает webhook Passport Serivce с заголовками клиента, откуда мы берем bearer токен и проверяем пользователя в базе. В ответ Hasura ожидает получить 200 или 401 ошибку с кастомными заголовками для проверки привелегий пользователя.

## Services

Временная папка содержащая все микросервисы. В будующием они будут разнесены на различные проекты.

### Passport

Сервис авторизации, содержит 3 ручки:

- POST **/login** - валидирует данные и передает их passport.js
- POST **/signup** - валидирует данные и с помощью Knex запроса создает их в PostgreSQL

> - Почему не через Hasura? Зачем дублировать схему?
> - Абстрагированние это хороший паттерн и возможность легко отказаться от необкатанной Hasura.

- GET **/webhook** - принимает от Hasura клиентский запрос и авторизирует пользователя
*webhook specs in progress...*

### Uploader

Сервис загрузки файлов, содержит 1 ручку:

- POST **/upload** - проверяем заголовки и отправляем файл в s3, на выходе

```javascript
  {
    // ...
    key: (req, file, cb) => {
      const uuid = uuidv4();
      const key = `${req.s3_key_prefix}${uuid}`;

      req.saved_files.push({
        originalname: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding,
        key,
      });

      cb(null, key);
    },
    // ...
  }
```

### Cinematic

Должен будет отвечать за доставку видео.

Предпологаемые ручки:
- POST **/video/{{videoId}}** - подставляет к запросу platformId из Sportrecs и проксирует запрос в него.

## Hasura

Важной частью системы является Hasura. Она отвечает за всю работу с данными и является входной точкой для клиента. Но, все сервисы, кроме сервиса авторизации в 1 ручке, ничего не знают о хасуре. Ее легко можно будет подменить своим GraphQL сервером и новой схемой авторизации.

### Permissions

Разрулирование привелегий устроено на уровне заголовков. Вы передаете кастомный `X-Hasura-*` заголовок, в котором содержится инпут для сравнения по схеме привелегий. Ее вы можете настроить в каждой таблице, для каждого столбца и строчки для всех CRUD операции. Hasura полностью доверяет переданным заголовкам т.к. они поступают от вашего сервиса авторизации. Два заголовка которые будут присутствовать в любом запросе:

- X-Hasura-Role - сервисный заголовок который содержит текущую роль для сравнения по схеме привелегий.
- X-Hasura-User-Id - кастомный заголовок который содержит ID текущего юзера для сравнения по таблице данных.

> - Почему Hasura не берет роль сразу из юзера?
> - Hasura ничего не знает о схема авторизации вашего приложения. Пользователи могут хранится в совершенно другом месте, а в Hasure только связанные с ним данные. Это кстати она из фич хасуры Remote-Schemas, где вы можете производить remote join в вашу GraphQL схему.

*readme in progress...*
