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
