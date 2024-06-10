Крок 1



Створіть гілку hw3-crud з гілки hw2-mongodb і виконуйте це завдання в гілці hw3-crud.

Організуйте роутинг в вашому застосунку:

винесіть код роутів з файлу src/server.js до файлу src/routers/contacts.js
винесіть код контролерів з файлу src/server.js до файлу src/controllers/contacts.js

//app.use(express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb',
  }))
Крок 2



Покращіть обробку помилок в вашому додатку. Для цього:



Додайте в залежності проєкта пакет http-errors для опрацювання різних помилок



Створіть і застосуйте в файлі src/server.js middleware errorHandler, призначений для обробки помилок у вашому Express-сервері. Цей middleware має приймати чотири аргументи. errorHandler у разі виявлення помилки має відправити клієнту відповідь зі статусом 500 та об’єкт з наступними властивостями:

status — статус відповіді
message — повідомлення про результат виконання операції "Something went wrong"
data — конкретне повідомлення про помилку, отримане з об'єкта помилки


Створіть і застосуйте у файлі src/server.js middleware notFoundHandler, призначений для обробки запитів, коли клієнт звертається до неіснуючого маршруту. notFoundHandler у разі виявлення помилки має відправити клієнту відповідь зі статусом 404 та об’єкт з наступними властивостями:

message — повідомлення про результат виконання операції "Route not found"


Створіть і застосуйте у файлі src/routers/contacts.js функцію ctrlWrapper, яка діятиме як обгортка для контролерів у вашому Express-додатку, для автоматичної обробки помилок, що можуть виникнути під час виконання запитів. В цій обгортці при виникненні помилки викличте next(err) для залучення middleware errorHandler



Для роута GET /contacts/:contactId додайте перевірку чи контакт за переданим contactId було знайдено. Якщо контакт не було знайдено, то за допомогою http-errors відповідь сервера має бути зі статусом 404 і містити об’єкт з наступними властивостями:

status — статус відповіді
message — повідомлення про результат виконання операції
data — об’єкт {message: "Contact not found"}


Крок 3



Створіть роут POST /contacts для створення нового контакту. Тіло запиту має в себе включати наступні властивості:

name - обов’язково
phoneNumber - обов’язково
email - не обовʼязково
isFavourite - не обовʼязково
contactType - не обовʼязково
Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/contacts.js
Опис контролера для цього роута в файлі src/controllers/contacts.js
Створення сервісу в файлі src/services/contacts.js
Відповідь сервера, в разі успішного створення нового контакту, має бути зі статусом 201 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції "Successfully created a contact!"
data — дані створеного контакту


Крок 4



Створіть роут PATCH /contacts/:contactId для оновлення даних існуючого контакту. Тіло запиту має в себе включати наступні властивості:

name - не обов’язково
phoneNumber - не обов’язково
email - не обовʼязково
isFavourite - не обовʼязково
contactType - не обовʼязково


Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/contacts.js
Опис контролера для цього роута в файлі src/controllers/contacts.js
Створення сервісу в файлі src/services/contacts.js
Відповідь сервера, в разі успішного оновлення даних контакту, має бути зі статусом 200 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції "Successfully patched a contact!"
data — оновлені дані контакту
Якщо контакт не було знайдено, то за допомогою http-errors відповідь сервера має бути зі статусом 404 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції
data — об’єкт {message: "Contact not found"}


Крок 5



Створіть роут DELETE /contacts/:contactId для видалення існуючого контакту.

Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/contacts.js
Опис контролера для цього роута в файлі src/controllers/contacts.js
Створення сервісу в файлі src/services/contacts.js
Відповідь сервера, в разі успішного видалення контакту, має бути зі статусом 204 без тіла відповіді
Якщо контакт не було знайдено, то за допомогою http-errors відповідь сервера має бути зі статусом 404 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції
data — об’єкт {message: "Contact not found"}


Крок 6



Поміняйте гілку, з якої зараз деплоїться ваш проєкт на render.com. Переконайтеся, що зміни успішно задеплоєні

//=====================================
// src/controllers/students.js

export const getStudentByIdController = async (
  req,
  res,
  next,
) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

	// Додаємо базову обробку помилки
  if (!student) {
    next(new Error('Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};
===================================
// src/controllers/students.js

export const getStudentsController = async (
  req,
  res,
	next,
) => {
	try {
	  const students = await getAllStudents();

	  res.json({
	    status: 200,
	    message: 'Successfully found students!',
	    data: students,
	  });
	} catch(err) {
		next(err);
	}
};

===========================
Створимо у папці src/utils файл ctrlWrapper.js, де оголосимо та експортуємо функцію-обгортку ctrlWrapper.

// src/utils/ctrlWrapper.js

export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};



Після цього можемо використати цю функцію у роутах для обгортання контролерів.

// src/routers/students.js

import { Router } from 'express';

import {
  getStudentsController,
  getStudentByIdController,
} from '../controllers/students';
import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));

router.get('/students/:studentId', ctrlWrapper(getStudentByIdController));

export default router;

===============================

Організація middleware
Винесімо нашу middleware, що обробляє помилки, в окремий файл

Додамо папку src/middlewares для зберігання кастомних middleware
В папці middlewares створимо файл errorHandler.js
Перенесемо код middleware обробки помилок із server.ts у errorHandler.ts


 // src/middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};**



Також винесемо в окремий файл middleware обробки випадку, коли клієнт звертається до неіснуючого маршруту

В папці middlewares створимо файл notFoundHandler.js
Перенесемо код middleware обробки помилок із server.js у notFoundHandler.js
 // src/middlewares/notFoundHandler.js

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
};



Після цього у файлі server.js імпортуємо наші middleware та додамо за допомогою app.use.

// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import studentsRouter from './routers/students.js';
import { env } from './utils/env.js';
// Імпортуємо middleware
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.use(studentsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

=====================================

npm install http-errors



У файлі контролера використаємо http-errors для налаштування помилки наступним чином:

 // src/controllers/students.js

// 1. Імпортуємо функцію з бібліотеки
import createHttpError from 'http-errors';

/* Інший код файлу */

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    // 2. Створюємо та налаштовуємо помилку
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};



В імпортовану функцію передаємо 2 аргументи. Першим — код помилки, а другим — рядок, що містить опис помилки для об'єкта відповіді.

Далі виконаємо рефакторинг errorHandler middleware, додавши в ній можливість працювати з помилками, створеними за допомогою http-errors :

// src/middlewares/errorHandler.js

// Імпортуємо клас HttpError для обробки помилок HTTP з відповідними статус-кодами
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};



Тепер, якщо відправити запит на отримання даних студента по id, якого не існує в базі даних, ми отримаємо у відповідь статус 404 і відповідне повідомлення:
=====================

const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

export default notFoundMiddleware;

=====================
// src/services/students.js

import { StudentsCollection } from '../db/models/student.js';**

/* Решта коду файла */
****
export const updateStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentsCollection.findOneAndUpdate(
    { _id: studentId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

===========================
Контролер



Використаємо функцію сервісу у контролері та додамо типізацію запиту та відповіді:

// src/controllers/students.js

import createHttpError from 'http-errors';

import { updateStudent } from "../services/students.js";

/* Решта коду файла */

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await updateStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};

==========================
Додаємо обробку помилки валідації!!!!!!!!
  if (err instanceof MongooseError) {
      return res.status(404).json({
        status: 404,
        message: "Mongoose error!",
      });
    }
