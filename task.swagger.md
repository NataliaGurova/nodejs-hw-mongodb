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

=======
openapi: 3.1.0
info:
  version: 1.0.0
  title: Contacts app
  license:
    name: Apache 2.0
    url: <http://www.apache.org/licenses/LICENSE-2.0.html>
  description: >
    This is a documentation of Contacts app
tags:
  - name: Contacts
    description: Operations with contacts.
  - name: Auth
    description: Auth operations.
servers:
  - url: http://localhost:3000
  - url: https://nodejs-hw-mongodb-vrqs.onrender.com
paths:
  /contacts:
    get:
      $ref: ../swagger/paths/contacts/get.yaml
    post:
      $ref: ../swagger/paths/contacts/post.yaml
  /contacts/{id}:
    get:
      $ref: ../swagger/paths/contacts/{id}/get.yaml
    patch:
      $ref: ../swagger/paths/contacts/{id}/patch.yaml
    delete:
      $ref: ../swagger/paths/contacts/{id}/delete.yaml
  /auth/register:
    post:
      $ref: ../swagger/paths/auth/register/post.yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

  ============
  openapi: 3.1.0
info:
  version: 1.0.0
  title: Contacts app
  license:
    name: Apache 2.0
    url: <http://www.apache.org/licenses/LICENSE-2.0.html>
  description: >
    This is a documentation of Contacts app
tags:
  # теги, що ви будете використовувати
  - name: Contacts
    description: Operations about contacts.
  - name: Auth
    description: Auth operations.
servers:
  - url: http://localhost:3000
  - url: #посилання на задеплоєний сайт
paths:
    /contacts:
    get:
      $ref: ../swagger/paths/contacts/get.yaml
    post:
      $ref: ../swagger/paths/contacts/post.yaml
  /contacts/{contactId}:
    get:
      $ref: ../swagger/paths/contacts/{contactId}/get.yaml
    patch:
      $ref: ../swagger/paths/contacts/{contactId}/patch.yaml
    delete:
      $ref: ../swagger/paths/contacts/{contactId}/delete.yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

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

==================================================

# swagger/paths/studens/{id}/get.yaml
tags:
  - Students
summary: Get student by id
operationId: getStudent
description: 'Get student by id'
security:
  - bearerAuth: []
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
      example: '65ca67e7ae7f10c88b598384'
responses:
  '200':
    description: 'Get student by id'
    content:
      application/json:
        schema:
          type: object
          required:
            - status
            - message
            - data
          properties:
            status:
              type: integer
              example: 200
            message:
              type: string
              example: Successfully found student with id 65ca67e7ae7f10c88b598384!
            data:
              type: object
              $ref: '../../../components/schemas/student.yaml'
  '401':
    $ref: '../../../components/responses/401.yaml'
==========


========!!!!====
tags:
  - Students
summary: Create student
operationId: createStudent
description: 'Create a student with payload'
security:
  - bearerAuth: []
requestBody:
  content:
    multipart/form-data:
      schema:
        type: object
        required:
          - name
          - age
          - gender
          - avgMark
          - parentId
        properties:
          name:
            description: "Student's name"
            type: string
            example: 'John Doe'
          age:
            description: "Student's age"
            type: number
            example: 12
          gender:
            description: "Student's age"
            type: string
            enum: ['male', 'female', 'other']
          avgMark:
            description: "Student's average mark. Should be between 1 and 12"
            type: number
            example: 9.7
          onDuty:
            description: 'Whether is student on duty'
            type: boolean
            example: false
          parentId:
            description: "Student's parent id"
            type: string
            example: 65e4decdd286b30065d54af9
          photo:
            description: "Student''s photo"
            type: string
            format: binary
responses:
  '201':
    description: Creates a student
    content:
      application/json:
        schema:
          type: object
          required:
            - status
            - message
            - data
          properties:
            status:
              type: integer
              example: 200
            message:
              type: string
              example: Successfully created a student!
            data:
              type: object
              $ref: '../../components/schemas/student.yaml'
  '401':
    $ref: '../../components/responses/401.yaml'
===============




Для цього створимо у файлі src/constants/index.js константу SWAGGER_PATH :

// src/constants/index.js

/* Інший код файлу */

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');



У файлі src/middlewares/swaggerDocs.js опишемо функцію swaggerDocs :

// src/middlewares/swaggerDocs.js

import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};



Застосуємо цю функцію до роуту /api-docs :

// src/server.js

import { swaggerDocs } from './middlewares/swaggerDocs.js';

/* Інший код файлу */

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

/* Інший код файлу */



Тепер ми можемо виконати в терміналі команду npm run build-docs, яку ми описали раніше в файлі package.json, для того, щоб збілдити документацію для Swagger. Далі запускаємо наш сервер командою npm run dev і можемо у браузері перейти за маршрутом https://localhost:3000/api-docs і побачити нашу документацію.



# swagger/paths/studens/{id}/get.yaml
tags:
  - Students
summary: Get student by id
operationId: getStudent
description: 'Get student by id'
security:
  - bearerAuth: []
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
      example: '65ca67e7ae7f10c88b598384'
responses:
  '200':
    description: 'Get student by id'
    content:
      application/json:
        schema:
          type: object
          required:
            - status
            - message
            - data
          properties:
            status:
              type: integer
              example: 200
            message:
              type: string
              example: Successfully found student with id 65ca67e7ae7f10c88b598384!
            data:
              type: object
              $ref: '../../../components/schemas/student.yaml'
  '401':
    $ref: '../../../components/responses/401.yaml'
