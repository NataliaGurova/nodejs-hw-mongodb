
Крок 2



Створіть модель User з такими полями:

name - string, required
email - string, email, unique, required
password - string, required
createdAt - дата створення
updatedAt - дата оновлення


Створіть модель Session з такими полями:

userId - string, required
accessToken - string, required
refreshToken - string, required
accessTokenValidUntil - Date, required
refreshTokenValidUntil - Date, required


Крок 3



Створіть роут POST /auth/register  для реєстрації нового користувача. Тіло запиту має в себе включати наступні властивості:

name - обов’язково
email - обов’язково
password - обов’язково (памʼятайте, що пароль має бути захешованим за допомогою бібліотеки bcrypt)


Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/auth.js
Валідацію отриманих даних
Опис контролера для цього роута в файлі src/controllers/auth.js
Створення сервісу в файлі src/services/auth.js
Переконайтеся, що користувач із такою поштою ще не існує в системі, поверніть за допомогою бібілотеки createHttpError 409 помилку в іншому випадку і повідомлення 'Email in use’.
Відповідь сервера, в разі успішного створення нового користувача, має бути зі статусом 201 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції "Successfully registered a user!"
data — дані створеного користувача (має бути відсутнє поле з паролем!)


Крок 4



Створіть роут POST /auth/login для аутентифікації користувача. Тіло запиту має в себе включати наступні властивості:

email - обовʼязково
password - обовʼязково


Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/auth.js
Валідацію отриманих даних
Опис контролера для цього роута в файлі src/controllers/auth.js
Створення сервісу в файлі src/services/auth.js
Переконайтеся, що користувач із такою поштою та паролем існує в системі, поверніть за допомогою бібілотеки createHttpError 401 помилку в іншому випадку.
Якщо користувача за переданими даними було знайдено, то створіть для нього сессію, в яку запишіть згенеровані access та refresh токени. Стара сесія, за її наявності, має бути видалена. Вкажіть час життя 15 хв для access токену та 30 днів для refresh токену.
Запишіть рефреш токен в cookies, а access токен поверніть в тілі відповіді.
Відповідь сервера, в разі успішного створення нового контакту, має бути зі статусом 200 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції "Successfully logged in an user!"
data — об'єкт з властивістю accessToken, що містить значення створеного access токена


Створіть роут POST /auth/refresh для оновлення сесії на основі рефреш токена,

який записаний в cookies.



Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/auth.js
Опис контролера для цього роута в файлі src/controllers/auth.js
Створення сервісу в файлі src/services/auth.js
Попередня сесія, за її наявності, має бути видалена, а нова створена за тим самим принципом, що і в POST /auth/login.
Відповідь сервера, в разі успішного створення нового контакту, має бути зі статусом 200 і містити об’єкт з наступними властивостями:
status — статус відповіді
message — повідомлення про результат виконання операції "Successfully refreshed a session!"
data — об'єкт з властивістю accessToken, що містить значення новоствореного access токена


Крок 6



Створіть роут POST /auth/logoutдля видалення сесії на основі id сесії та токена, який записаний в cookies.

Обробка цього роута має включати:

Реєстрацію роута в файлі src/routers/auth.js
Опис контролера для цього роута в файлі src/controllers/auth.js
Створення сервісу в файлі src/services/auth.js
Поточна сесія має бути видалена.
Відповідь сервера, в разі успішного створення нового контакту, має бути зі статусом 204, без тіла відповіді.


Крок 7



Створіть middleware authenticate, який буде на основі access токену з заголовку Authorization у вигляді Bearer-токену, визначати користувача і додавати його до обʼєкту запиту(req) у вигляді властивості user. При цьому переконайтеся, що access токен не протермінований, інакше за допомогою бібліотеки createHttpError поверніть помилку зі статусом 401 і повідомленням “Access token expired”.

Застосуйте цей middleware до всіх роутів, які потребують перевірку аутентифікації:

усі роути контактів
роути /auth/refresh, /auth/logout.


Крок 8



Розширте модель Contact обовʼязковим полем userId, яке буде вказувати на приналежність контакта певному користувачу.

Змініть логіку роута POST /contacts, щоб при створенні нового контакту також додавалося поле userId. Значення для userId візьміть із req.user._id.

Також змініть логіку для всіх інших роутів, які працюють з колекцією контактів, щоб користувачі могли працювати лише з власними контактами. Для цього у сервісних функціях використовуйте методи Mongoose такі як find(), findOne() тощо, щоб мати можливість шукати контакти окрім іншого і за значенням властивості userId.



Крок 9



Поміняйте гілку, з якої зараз деплоїться ваш проєкт на render.com, на hw5-auth. Переконайтеся, що зміни успішно задеплоєні.

===========================

Створимо окремий роутер для авторизації:

// src/routers/auth.js

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

export default router;



Оскільки у нас тепер є 2 окремі роути, для взаємодією з колекцією студентів і колекцією користувачів, краще винести їх підключення в окремий файл src/routers/index.js:

// src/routers/index.js

import { Router } from 'express';
import studentsRouter from './students.js';
import authRouter from './auth.js';

const router = Router();

router.use('/students', studentsRouter);
router.use('/auth', authRouter);

export default router;



Після винесення шляху "/students" до окремого роуту, відповідні зміни потрібно внести і у файл src/routers/contacts.js:

// src/routers/contacts.js

import { Router } from 'express';

import {
  getStudentsController,
  getStudentByIdController,
  createStudentController,
  deleteStudentController,
  upsertStudentController,
  patchStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStudentSchema,
  updateStudentSchema,
} from '../validation/students.js';

const router = Router();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:studentId', ctrlWrapper(getStudentByIdController));

router.post(
  '',
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);

router.delete('/:studentId', ctrlWrapper(deleteStudentController));

router.put(
  '/:studentId',
  validateBody(createStudentSchema),
  ctrlWrapper(upsertStudentController),
);

router.patch(
  '/:studentId',
  validateBody(updateStudentSchema),
  ctrlWrapper(patchStudentController),
);

export default router;




Також потрібно оновити підключення роутів до нашого сервера у файлі src/server.js:

// src/server.js

/* Інший код з файлу */

// замість цього імпорту і підключення
import studentsRouter from './routers/students.js';
app.use(studentsRouter);

// робимо такий імпорт і підключення
import router from './routers/index.js';
app.use(router);


================================
Хешування паролів



Зараз пароль буде зберігатися в базі даних в тому вигляді, в якому його передав користувач. Це дуже небезпечно. Досить велика кількість людей використовує одні і ті самі паролі в декількох сервісах і викриття одного з них може чинити загрозу для всіх інших. І тут нам на допомогу приходить хешування.

Хешування - це процес перетворення даних будь-якого розміру в фіксований рядок фіксованої довжини, який зазвичай називається хеш-значенням або хеш-кодом. Одна з основних властивостей хеш-функції полягає в тому, що вона повинна бути швидкою та ефективною для обчислення.



Основні характеристики хеш-функцій включають:

Фіксована довжина виходу: Незалежно від розміру вхідних даних, хеш-функція повертає хеш-значення фіксованої довжини.
Внутрішня унікальність: Різні вхідні дані повинні генерувати різні хеш-значення.
Відсутність реверсивності: Важко або неможливо відновити вхідні дані з хеш-значення.
Спрощення великих даних: Хеш-функція може генерувати відносно короткі хеш-значення, навіть для великих вхідних даних.
Стійкість до змін вхідних даних: Малі зміни у вхідних даних повинні призводити до великих змін в хеш-значенні.


Хеш-функції використовуються в різних областях, таких як криптографія, забезпечення цілісності даних, створення підписів, робота з хеш-таблицями та інше. У сучасному програмуванні хеш-функції широко використовуються для збереження паролів у вигляді хеш-значень, що допомагає уникнути збереження самого пароля в текстовому вигляді.



Тому і ми застосуємо хешування для зберігання паролю і скористаємось бібліотекою bcrypt. Встановимо її командою:

npm i bcrypt



Та додамо її у сервісну функції registerUser:

// src/services/auth.js

import bcrypt from 'bcrypt';

import { UsersCollection } from '../db/models/user.js';

export const registerUser = async (payload) => {
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};



Під час створення моделі UsersCollection ми вказали, що email користувача має бути унікальним. Тому нам варто перевіряти email на унікальність під час реєстрації та, у разі дублювання, повертати відповідь зі статусом 409 і відповідним повідомленням. Тому додамо таку перевірку у код нашого сервісу для реєстрації:



// src/services/auth.js

import bcrypt from 'bcrypt';

import { UsersCollection } from '../db/models/user.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};


==============================
Логін користувачів


Тепер давайте створимо функціонал логіну.



Загалом, наша аутентифікація буде базуватися на сесії, і ми будемо використовувати пару refresh+access токенів:



Створимо функцію в сервісі для login:

// src/services/auth.js

import createHttpError from 'http-errors';

/* Інший код файлу */

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // далі ми доповнемо цей контролер
};



Створимо контролер:

// src/controllers/auth.js

import { loginUser } from '../services/auth.js';

/* Інший код файлу */

export const loginUserController = async (req, res) => {
  await loginUser(req.body);

  // далі ми доповнемо цей контролер
};



Створимо схему для валідації:

// src/validation/auth.js

/* Інший код файлу */

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});



Створимо окремий роутер для login:

// src/routers/auth.js

import { loginUserSchema} from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';

/* Інший код файлу */

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

======================================
Cесії. Access+refresh tokens


Основні аспекти сесій включають:

Ідентифікатор сесії (Session ID): Кожна сесія має унікальний ідентифікатор, який використовується для пов'язування інформації між клієнтом та сервером. Ідентифікатор сесії зазвичай передається через куки або включається у URL.
Збереження стану: Сесії дозволяють зберігати дані про стан, пов'язаний з конкретним користувачем, на сервері. Ці дані можуть включати інформацію про входження в систему, корзину покупок, налаштування користувача та інше. В нашому випадку сесія буде відповідати лише за авторизацію, але за потреби її можна буде розширити. Також майте на увазі, що в сесії можна зберігати лише те, що не критично втратити.
Тривалість: Сесії можуть мати обмежений термін дії, наприклад, певну кількість хвилин або годин. Це визначає час, протягом якого дані сесії залишаються активними.
Безпека: Деякі механізми сесій додатково захищають дані, використовуючи шифрування або інші методи для уникнення несанкціонованого доступу.
Серверна та клієнтська частини: Сесії зазвичай включають серверну та клієнтську частини. Серверна частина відповідає за зберігання та управління даними сесії, тоді як клієнтська частина (зазвичай у вигляді куків) містить ідентифікатор сесії, який використовується при кожному запиті.


За допомогою сесій веб-сайти можуть зберігати інформацію, яка пов'язана з конкретним користувачем, і забезпечувати персоналізований та безпечний досвід використання.



Для роботи із сесіями ми створимо ще одну колекцію:

// src/db/models/session.js

import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('sessions', sessionsSchema);



Наша сесія буде складатися з:

Access токену - короткоживучий(в нашому випадку 15 хвилин) токен, який браузер буде нам додавати в хедери запитів (хедер Authorization)
Терміну життя access токену
Refresh токену - більш довгоживучому (в нашому випадку 1 день, але може бути і більше) токену, який можна буде обміняти на окремому ендпоінті на нову пару access + resfresh токенів. Зберігається в cookies(поговоримо про них детальніше трохи далі)
Терміну життя refresh токену
Id юзера, якому належить сесія.


Додамо у файл констант нові константи:

// src/constants/index.js

/* Інший код файлу */

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;



Тепер ми можемо створити функціонал по створенню сесій:

// src/services/auth.js

import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

/* Інший код файлу */

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

===========================
// src/controllers/auth.js

import { ONE_DAY } from '../constants/index.js';

/* Інший код файлу */

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


=======================================
Оновлення сессії за допомогою рефреш токену


Ми вже на фінішній прямій у імплементації основи авторизації та аутентифікації в нашому проєкті. Залишилося лише імплементувати ротацію токенів за допомогою refresh токену:



Створимо функцію в сервісі для refresh:

// src/services/auth.js

/* Інший код файлу */

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  
  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};



Функція refreshUsersSession виконує процес оновлення сесії користувача і взаємодію з базою даних через асинхронні запити. Ось детальне пояснення її роботи:



Пошук існуючої сесії:

Функція приймає об'єкт, що містить sessionId і refreshToken.
Вона шукає в колекції SessionsCollection сесію з відповідним sessionId та refreshToken.
Якщо сесію не знайдено, функція викликає помилку з кодом 401 (Сесію не знайдено).


Перевірка терміну дії токена сесії:

Функція перевіряє, чи не минув термін дії refreshToken. Якщо поточна дата перевищує значення refreshTokenValidUntil, це означає, що токен сесії прострочений.
Якщо токен сесії прострочений, функція викликає помилку з кодом 401 (Токен сесії прострочений).


Створення нової сесії:

Функція викликає createSession, яка генерує нові accessToken і refreshToken, а також встановлює терміни їхньої дії.
createSession повертає об'єкт з новими токенами і термінами їхньої дії.


Збереження нової сесії в базі даних:

Функція створює нову сесію в колекції SessionsCollection, використовуючи ідентифікатор користувача з існуючої сесії та дані нової сесії, згенеровані функцією createSession.
Нову сесію збережено в базі даних і функція повертає її.


Таким чином, функція refreshUsersSession обробляє запит на оновлення сесії користувача, перевіряє наявність і термін дії існуючої сесії, генерує нову сесію та зберігає її в базі даних.



Наступним кроком створимо контролер:

// src/controllers/auth.js

import { refreshUsersSession } from '../services/auth.js';

/* Інший код файлу */

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};



Функція refreshUserSessionController виконує процес оновлення сесії користувача і взаємодію з клієнтом через HTTP. Ось детальне пояснення її роботи:



Виклик функції оновлення сесії:

Функція приймає об'єкти запиту (req) і відповіді (res).
Вона викликає функцію refreshUsersSession, передаючи їй об'єкт з sessionId та refreshToken, отримані з куків запиту (req.cookies.sessionId та req.cookies.refreshToken).
refreshUsersSession виконує процес оновлення сесії і повертає об'єкт нової сесії.


Встановлення нових куків:

Функція викликає setupSession, передаючи їй об'єкт відповіді (res) та нову сесію.
setupSession встановлює два куки: refreshToken і sessionId, використовуючи метод res.cookie.
refreshToken зберігається як http-only cookie, що означає, що він доступний тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Він має термін дії один день.
sessionId також зберігається як http-only cookie з аналогічним терміном дії.


Відправлення відповіді клієнту:

Функція формує JSON-відповідь, яка включає статусний код 200, повідомлення про успішне оновлення сесії та дані, що містять accessToken.
Використовується метод res.json для відправлення відповіді клієнту.


Таким чином, функція refreshUserSessionController обробляє HTTP-запит на оновлення сесії користувача, викликає функцію для оновлення сесії refreshUsersSession, встановлює нові куки для збереження токенів та ідентифікатора сесії, і відправляє клієнту відповідь з інформацією про успішне оновлення сесії та новим токеном доступу.



Тепер створимо окремий роутер для refresh:

// src/routers/auth.js

import { refreshUserSessionController } from '../controllers/auth.js';

/* Інший код файлу */

router.post('/refresh', ctrlWrapper(refreshUserSessionController));



І давайте пройдемося по всьому функціоналу:



