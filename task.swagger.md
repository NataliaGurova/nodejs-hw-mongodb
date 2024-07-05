Крок 1

Створіть гілку hw7-swagger з гілки hw6-email-and-imagesі виконуйте це завдання в гілці hw7-swagger.



Крок 2

Встановіть пакет @redocly/cli як Dev залежність:

npm install @redocly/cli --save-dev



Додайте в розділ із скриптами в package.json нові команди:

{
  "scripts": {
    "build": "npm run build-docs",
    "build-docs": "redocly bundle --ext json -o docs/swagger.json",
    "preview-docs": "redocly preview-docs"
  }
}



Створіть файл redocly.yaml із таким вмістом:

# See <https://redocly.com/docs/cli/configuration/> for more information.
apis:
  sample@v1:
    root: docs/openapi.yaml
extends:
  - recommended
rules:
  no-unused-components: error
theme:
  htmlTemplate: ./docs/index.html
  colors:
    primary:
      main: '#32329f'
  generateCodeSamples:
    languages:
      - lang: curl
      - lang: Node.js
      - lang: JavaScript



Створіть в корні проєкту папку docs, в ній створіть файл index.html із таким контентом:

<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>API Reference | ReDoc</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="favicon.png">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
  {{{redocHead}}}
</head>

<body>
  {{{redocHTML}}}
</body>

</html>



Створіть файл docs/openapi.yaml з наступним вмістом:

openapi: 3.1.0
info:
  version: 1.0.0
  title: <назва вашого додатку>
  license:
    name: Apache 2.0
    url: <http://www.apache.org/licenses/LICENSE-2.0.html>
  description: >
    <опис вашого додатку>
tags:
  # теги, що ви будете використовувати
servers:
  - url: <http://localhost:3000>
  - url: #посилання на задеплоєний сайт
paths:
  # тут будуть посилання на ендпоінти
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

Запустіть команду npm run preview-docs, щоб бачити внесені зміни.



Крок 3



Створіть папку swagger. У неї додайте папки components та paths. В папці components зберігайте частини сутностей, наприклад, опис відповідей або сутностей. В папці paths зберігайте файли документації відповідно до схеми побудови шляху. Наприклад, для роуту GET /contacts/:contactId відповідним файлом буде /swagger/paths/contacts/{id}/get.yaml.



Крок 4



Додайте документацію для роута GET /contacts/:contactId у відповідний файл. У ній має бути:

tags - тег, до якого цей ендпоінт належить (Contacts)
summary - короткий опис ендпоінта
operationId - унікальний ідентифікатор операції
description - більш розгорнутий опис
security - зазначте, що ми використовуємо авторизацію за допомогою Bearer токену
parameters - параметри запиту (для цього ендпоінту - параметр шляху :contactId)
responses - варіанти відповіді
200
404
Додайте посилання на цей ендпоінт до файлу ./docs/openapi.yaml.



Крок 5



Додайте за тим самим принципом документацію для ендпоінтів:

GET /contacts
PATCH /contacts/:contactId
DELETE /contacts/:contactId
POST /contacts
Не забудьте описати query параметри для GET /contacts та body для запитів, що його містять.



Крок 6 (не обов’язково!)



За бажанням напишіть документацію для ендпоінтів авторизації.



Крок 7



Додайте окремий роут /api-docs, на якому запустіть відображення документації за допомогою пакету swagger-ui-express.



Крок 8



Поміняйте гілку, з якої деплоїться проєкт на render.com, на hw7-swagger. Переконайтеся, що зміни успішно задеплоєні.

Це завдання допоможе вам створити зручну та інформативну документацію для вашого API. Успіхів у виконанні завдання! 🚀
