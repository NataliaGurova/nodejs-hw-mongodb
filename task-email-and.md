Крок 1

Створіть гілку hw6-email-and-images з гілки hw5-auth і виконуйте це завдання в гілці hw6-email-and-images.



Крок 2

Створіть акаунт на brevo.com. Цей сервіс буде використаний для надсилання повідомлень по електронній пошті.



Крок 3

Створіть роут POST /auth/send-reset-email. В body він має приймати емейл користувача (властивість email).

За допомогою пакету nodemailer (використовуйте кредити з Brevo для підʼєднання до SMTP-серверу) організуйте відправку емейла користувачу з посиланням для скиду паролю.

Посилання має складатися з:

Домена, на якому буде знаходитися фронтенд нашого додатку (взяти із змінних оточення);
Шляху до сторінки з скидом паролю - /reset-password;
Query-параметеру token, який дорівнює JWT токену, що був створений на бекенді і містить email користувача. Термін життя токену встановіть 5 хвилин.


Загальне посилання виглядатиме так:

https://<your-frontend-domain>/reset-password?token=<jwt-token>

На цьому етапі усі чутливі дані мають бути винесені в змінні оточення.


https://www.brevo.com/
Дані для підключення до Brevo:

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM


Змінна, яка буде використовуватися для генерації підпису нашого токену:

JWT_SECRET


Домен, на якому знаходиться фронтенд нашого додатку:

APP_DOMAIN (поки що можна використати зі значенням “http://localhost:3000/auth”)
Обов’язково додайте ці змінні оточення до файлу .env.example.


Обробіть такі помилки як:

помилка валідації body (використайте middleware validateBody);
відсутній користувач в базі (за допомогою http-errors створіть помилку зі статусом 404 і повідомленням "User not found!");
не вдалося надіслати листа (за допомогою http-errors створіть помилку зі статусом 500 і повідомленням "Failed to send the email, please try again later.").


У разі успішного надсилання листа відповідь сервера має бути зі статусом 200 та містити об’єкт з наступними властивостями:

   {
       status: 200,
       message: "Reset password email has been successfully sent.",
       data: {}
   }



Крок 4



Створіть роут POST /auth/reset-pwd.

В body він має приймати:

властивість token - JWT токен, який був переданий у посилання для скиду паролю в попередньому кроці;
властивість password - новий пароль.
Переконайтеся, що отриманий в body JWT токен дійсний і не протермінований.



Обробіть такі помилки як:

помилка валідації body (використайте middleware validateBody);
відсутній користувач в базі (за допомогою http-errors створіть помилку зі статусом 404 і повідомленням "User not found!");
протермінований або пошкоджений токен (передайте до виклику createHttpError статус 401 і повідомлення "Token is expired or invalid.").


Якщо з токеном все добре, то для користувача з email, що міститься в токені:

оновіть пароль;
видаліть поточну сесію для цього користувача.


У разі успішної заміни паролю відповідь сервера має бути зі статусом 200 та містити об’єкт з наступними властивостями:

   {
       status: 200,
       message: "Password has been successfully reset.",
       data: {}
   }



Крок 5

Зареєструйтесь на Cloudinary.



Крок 6

Розширте функціонал можливістю завантажувати фотографії для роутів:

POST /contacts
PATCH /contacts/:contactId
Додайте підтримку Content-Type: multipart/formdata для цих ендпоінтів.
Додайте поле photo типу String в моделі Contact.
Додайте завантаження файлів на cloudinary. Посилання на файл фото запишіть в базу у поле photo. Переконайтеся, що в усіх ендпоінтах, де є робота з контактами, присутня можливість отримати посилання на фото.


Крок 7

Поміняйте гілку, з якої зараз деплоїться ваш проєкт на render.com, на hw6-email-and-images. Переконайтеся, що зміни успішно задеплоєні.

Це завдання допоможе вам створити зручний та безпечний механізм для роботи з користувацькими паролями та завантаженням зображень. Успіхів у виконанні завдання! 🚀
================================

// src/services/auth.js

import jwt from 'jsonwebtoken';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  });
};
=================

// src/services/auth.js

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

/* Інший код файлу */

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};



==========================
IMAGE

// src/index.js

import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

void bootstrap();

-------------------------
// src/routers/students.js

import { upload } from '../middlewares/multer.js';

/* Інший код файлу */

router.post(
  '/',
  checkRoles(ROLES.TEACHER),
  validateBody(createStudentSchema),
  upload.single('photo'), // додаємо цю middleware
  ctrlWrapper(createStudentController),
);

router.put(
  '/:studentId',
  checkRoles(ROLES.TEACHER),
  validateBody(createStudentSchema),
  upload.single('photo'), // додаємо цю middleware
  ctrlWrapper(upsertStudentController),
);

router.patch(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  validateBody(updateStudentSchema),
  upload.single('photo'), // додаємо цю middleware
  ctrlWrapper(patchStudentController),
);

----------------------

// src/controllers/students.js

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;

	/* в photo лежить обʼєкт файлу
		{
		  fieldname: 'photo',
		  originalname: 'download.jpeg',
		  encoding: '7bit',
		  mimetype: 'image/jpeg',
		  destination: '/Users/borysmeshkov/Projects/goit-study/students-app/temp',
		  filename: '1710709919677_download.jpeg',
		  path: '/Users/borysmeshkov/Projects/goit-study/students-app/temp/1710709919677_download.jpeg',
		  size: 7
	  }
	*/

	/* Інший код контролеру */
};


---------------------
// src/utils/saveFileToUploadDir.js

import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};

--------------
// src/db/models/student.js

import { model, Schema } from 'mongoose';

const studentsSchema = new Schema(
  {
    /* Інший код файлу */

    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const StudentsCollection = model('students', studentsSchema);

-------------------
Використаємо тепер функцію saveFileToUploadDir в контроллері:

// src/controllers/students.js

import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

/* Інший код файлу */

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const result = await updateStudent(studentId, {
    ...req.body,
    photo: photoUrl,
  });

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


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


Для того щоб додати підтримку Content-Type: multipart/form-data для маршрутів POST і PATCH, вам потрібно скористатися бібліотекою multer для обробки завантажених файлів. Ось як це можна зробити:

Крок 1: Встановлення Multer
Встановіть multer за допомогою npm або yarn:

bash
Копіювати код
npm install multer
або

bash
Копіювати код
yarn add multer
Крок 2: Налаштування Multer
Створіть файл middlewares/multer.js, в якому буде налаштовано multer для обробки завантажених файлів:

middlewares/multer.js
javascript
Копіювати код
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'temp')); // Тимчасова директорія для завантаження
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
Крок 3: Використання Multer у маршрутах
Додайте multer як middleware до ваших маршрутів POST і PATCH:

routes/contacts.js
javascript
Копіювати код
import express from 'express';
import { createContactController, patchContactController } from '../controllers/contacts.js';
import { upload } from '../middlewares/multer.js';
import { authenticate } from '../middlewares/authenticate.js'; // Приклад middleware для автентифікації

const router = express.Router();

router.post('/contacts', authenticate, upload.single('avatar'), createContactController);
router.patch('/contacts/:contactId', authenticate, upload.single('avatar'), patchContactController);

export default router;
Крок 4: Оновлення контролерів
Переконайтеся, що ваші контролери правильно обробляють завантажені файли.

controllers/contacts.js
javascript
Копіювати код
import { createContact, updateContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const createContactController = async (req, res, next) => {
  const { body, file } = req;

  try {
    const contact = await createContact({ ...body, avatar: file }, req.user._id);

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { body, file } = req;
  const { contactId } = req.params;

  try {
    const contact = await updateContact(contactId, { ...body, avatar: file }, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
services/contacts.js
javascript
Копіювати код
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { ContactCollection } from '../db/models/contact.js';

export const createContact = async ({ avatar, ...payload }, userId) => {
  const url = await saveFileToUploadDir(avatar);

  const contact = await ContactCollection.create({
    ...payload,
    userId,
    avatarUrl: url,
  });
  return contact;
};

export const updateContact = async (contactId, { avatar, ...payload }, userId) => {
  let url;

  if (avatar) {
    url = await saveFileToUploadDir(avatar);
    payload.avatarUrl = url;
  }

  const contact = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );

  return contact;
};
Підсумок
Ці кроки дозволять вам підтримувати Content-Type: multipart/form-data для завантаження файлів у ваших POST і PATCH маршрутах для контактів. Це забезпечить можливість обробки завантажених файлів, збереження їх у відповідній директорії та оновлення відповідних полів у базі даних.









