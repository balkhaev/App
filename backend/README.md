# Kinovert Backend

Маршрутизирующий бекенд для Kinovert project.

Состоит из следующих типов ручек:
- Proxy ручка - перенаправляет запрос на соответствующий сервис.
- Webhook ручка - принимает встраиваемый в логику сервиса запрос.
- Callback ручка - принимает обратный запрос от сервиса когда он закончил какое-либо действие.

Эти три типа ручек должны составлять ВСЮ логику приложения.

## Backend admin

Внутри директории `/admin` находится react-admin. Его `/admin/build` папка раздается Backend'ом.