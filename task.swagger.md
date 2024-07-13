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




# swagger/components/schemas/student.yaml

type: object
required:
  - _id
  - name
  - age
  - gender
  - avgMark
  - onDuty
properties:
  _id:
    description: "Student's id"
    type: string
    example: 65e4decdd286b30065d54af9
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
    description: "Link to student's photo"
    type: string
    example: <https://res.cloudinary.com/uqwgdu/image/upload/image.png>







# /docs/openapi.yaml
openapi: 3.1.0
info:
  version: 1.0.0
  title: Students app
  license:
    name: Apache 2.0
    url: <http://www.apache.org/licenses/LICENSE-2.0.html>
  description: >
    This is a documentation of students app
tags:
  - name: Students
    description: Operations about students.
  - name: Auth
    description: Auth operations.
servers:
  - url: <http://localhost:3000>
  - url: <https://example.com/api/v1>
paths:
  /students:
    get:
      $ref: ../swagger/paths/students/get.yaml #додаємо ще один шлях
    post:
      $ref: ../swagger/paths/students/post.yaml
  /students/{id}:
    get:
      $ref: ../swagger/paths/students/{id}/get.yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer


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

============
#/swagger/paths/students/get.yaml
============
tags:
  - Students
summary: Get list of students
operationId: getStudents
description: 'Get list of users with this endpoint'
security:
  - bearerAuth: []
parameters:
  - in: query
    name: page
    schema:
      type: integer
    example: 1
  - in: query
    name: perPage
    schema:
      type: integer
      example: 10
  - in: query
    name: sortBy
    schema:
      type: string
      example: 'age'
    description: "All student's fields can be mentioned. Default value - _id"
  - in: query
    name: sortOrder
    schema:
      type: string
      enum: ['asc', 'desc']
      example: 'asc'
  - in: query
    name: minAvgMark
    schema:
      type: number
      example: 4
  - in: query
    name: maxAvgMark
    schema:
      type: number
      example: 10
  - in: query
    name: minAge
    schema:
      type: number
      example: 10
  - in: query
    name: maxAge
    schema:
      type: number
      example: 16
  - in: query
    name: gender
    schema:
      type: string
      enum: ['male', 'female', 'other']
      example: male
responses:
  '200':
    description: Successfully found students!
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
              example: Successfully found students!
            data:
              type: object
              required:
                - data
                - page
                - perPage
                - totalItems
                - totalPages
                - hasNextPage
                - hasPreviousPage
              properties:
                data:
                  type: array
                  items:
                    $ref: '../../components/schemas/student.yaml'
                page:
                  type: number
                  example: 2
                perPage:
                  type: number
                  example: 4
                totalItems:
                  type: number
                  example: 4
                totalPages:
                  type: number
                  example: 4
                hasNextPage:
                  type: boolean
                  example: false
                hasPreviousPage:
                  type: boolean
                  example: true
  '401':
    $ref: '../../components/responses/401.yaml'

===========
#/swagger/paths/students/post.yaml
===========
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

==========================================
