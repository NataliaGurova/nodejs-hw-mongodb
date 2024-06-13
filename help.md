/*
process.argv   -- аргументи запуску
process.env    -- перелік всіх змінних оточення
process.exit() -- завершення процесу NodeJS
process.cwd()  -- поточна діректорія
*/

import express from 'express';

const PORT = 3000;

const app = express();
// Middleware для логування часу запиту
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
// наприклад, у запитах POST або PATCH
app.use(express.json());

// Маршрут для обробки GET-запитів на '/'
app.get('/', (request, response) => {
  response.json({
    message: 'Hello, World!',
  });
});
//включати цю middleware після всіх інших,
// оскільки вона буде виконана тільки в тому випадку, якщо ні один із попередніх маршрутів не відповідає запиту
app.use('*', (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});
// Middleware для обробких помилок (приймає 4 аргументи)
// Завжди пишемо останнім!!!
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//===========================
// Якщо
// app.use(middleware)
// app.use('*', middleware)
// то middleware буде застосований до всіх можливих роутів (маршрутів) на сервері
//===========================



Middleware із бібліотек


Логування запитів

npm install pino-http

npm i --save-dev pino-pretty
//--------
import pino from 'pino-http';

**/* Решта коду файла */**
Розташовувати після екземпляру app!!!
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);
!!!!!!!!!
Middleware для логування, такий як pino-http, слід розташовувати якомога раніше у ланцюгу middleware, щоб він міг логувати всі вхідні запити до вашого додатку, а також відповіді та можливі помилки, що виникають під час обробки цих запитів. Це означає, що pino повинен бути одним з перших мідлварів, які ви додаєте до екземпляру app.

CORS



CORS (Cross-Origin Resource Sharing) - це інструмент безпеки для веб-додатків, який дозволяє обмінюватися інформацією між веб-ресурсами з різних доменів. Наприклад, коли ви робите запит з фронтенду, який запущений на одному домені (vercel.com), до сервера, який на іншому (herokuapp.com).



Домен — це унікальне ім'я в Інтернеті, що використовується для доступу до вебсайтів, електронної пошти та інших ресурсів. Наприклад, у URL-адресі "https://goit.global/ua" доменним ім'ям є "goit.global".



Без CORS браузери не дозволяють вебзапитам отримувати ресурси з іншого домену через політику схрещеного походження. Щоб використовувати CORS на сервері, потрібно налаштувати відповідні HTTP-заголовки, які вказують, яким джерелам дозволено отримувати доступ. Заголовок Access-Control-Allow-Origin зі значенням * дозволяє отримувати доступ до ресурсу з будь-якого джерела:

Access-Control-Allow-Origin: *



В Express для цього використовується NPM-пакет cors. Щоб скористатися ним, встанови його командою

npm i cors   // встановлює пакет cors



і додай до свого Express додатку як middleware.

// src/index.js

import cors from 'cors';

/* Решта коду файла */

app.use(cors());
//==========================================

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

const PORT = 3000;

const app = express();

app.use(cors());

// Middleware для логування часу запиту
// app.use((req, res, next) => {
//   console.log(`Time: ${new Date().toLocaleString()}`);
//   next();
// });
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

// Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
// наприклад, у запитах POST або PATCH
app.use(express.json());

// Маршрут для обробки GET-запитів на '/'
app.get('/', (request, response) => {
  response.json({
    message: 'Hello, World!',
  });
});
//включати цю middleware після всіх інших,
// оскільки вона буде виконана тільки в тому випадку, якщо ні один із попередніх маршрутів не відповідає запиту
app.use('*', (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});
// Middleware для обробких помилок (приймає 4 аргументи)
// Завжди пишемо останнім!!!
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//===========================
// Якщо
// app.use(middleware)
// app.use('*', middleware)
// то middleware буде застосований до всіх можливих роутів (маршрутів) на сервері
//===========================


Змінні оточення
Будь-який додаток має бути пристосований для роботи в декількох середовищах (наприклад, на локальному компʼютері, в тестовому середовищі, на продакшені). Для кожного середовища може бути необхідність підключатися до своїх баз даних, використовувати певний набір API-ключів, мати якість налаштування, специфічні саме для цього середовища. Для розв'язання цієї задачі в розробці є таке поняття, як змінні оточення.



Змінні оточення (environment variables) — це змінні, які містять інформацію про конкретне оточення виконання програми або системи. Вони використовуються для зберігання конфігураційних параметрів, схованих ключів, шляхів до файлів, налаштувань серверів та іншої конфіденційної інформації, яка може відрізнятися від одного середовища до іншого.

За замовчуванням змінні оточення вказуються у файлі з назвою .env, який створюється у корені проєкту. В коді сервера ми вже мали гарний варіант, який би могли замінити на змінну оточення. Це порт, на якому буде запущений сервіс.



Традиційно, змінні оточення в файлі .env записуються великими літерами, хоча це не є суворою вимогою. Використання великих літер є конвенцією, яка допомагає легко відрізнити змінні оточення від звичайних змінних у коді, підвищуючи таким чином читабельність та підтримуваність коду. Тож, створімо у корені проєкту файл .env та оголосимо у ньому нашу першу змінну оточення PORT

// .env

PORT=3000



\.env файл має бути одразу доданий в .gitignore та ні в якому разі не повинен бути закоміченим в GitHub. Якщо все ж таки ви це зробили, то треба терміново змінити всі паролі і ключі, які були в цьому файлі. Навіть видалення цього файлу наступним коммітом не гарантує того, що доступ до нього не можна буде відновити.


Після створення змінних у файлі .env, гарною практикою буде створити файл .env.example, який повинен містити всі необхідні назви змінних оточення без реальних значень, щоб інші розробники могли зрозуміти структуру необхідних змінних для проєкту та налаштувати своє середовище розробки, не розкриваючи чутливу інформацію. Зверни увагу, що цей файл в .gitignore ми не додаємо.



// .env.example

PORT=



Щоб зчитувати та використовувати змінні оточення в додатку, потрібно буде встановити пакет [dotenv](<https://www.npmjs.com/package/dotenv>) командою:

npm install dotenv



Після чого ініціалізувати його у додатку викликавши метод dotenv.config():

// src/server.js

import dotenv from "dotenv";

dotenv.config();

// Решта коду файлу



Для доступу до змінних оточення в середовищі Node.js використовується глобальний об'єкт process.env, який доступний у коді будь-якого модуля (так само як window або document доступні у браузері).

// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Читаємо змінну оточення PORT
const PORT = Number(process.env.PORT);

export const startServer = () => {

	// Решта коду функції

	app.listen(PORT, () => {
	  console.log(`Server is running on ${PORT}`);
	});
};



Змінні оточення завжди визначаються як рядки. Важливо врахувати, що якщо необхідне значення має бути числом або булевим типом, його потрібно адекватно обробити. Саме з цієї причини ми використовуємо Number() для конвертації process.env.PORT у числовий тип.


З урахуванням можливості відсутності змінної оточення, корисним буде створити утилітарну функцію, яка перевірятиме її наявність і генеруватиме помилку, якщо змінна не встановлена. Тому давайте у папці utils створимо файл env.js, до якого перенесемо ініціалізацію dotenv. В цьому файлі оголосимо функцію env, призначену для читання змінних оточення.



// src/utils/env.js

import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}

//  Використати її ми можемо, наприклад, в такому вигляді: env('PORT', '3000');
//  Якщо змінної оточення з такою назвою не було вказано і не було передано дефолтного значення,
// то виклик цієї функції викине помилку з повідомленням Missing: process.env['PORT'].



Імпортуємо функцію env у файл server.js та використовуємо її для читання змінної оточення PORT.

// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';

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

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};



В цьому лонгріді ми:

познайомилися з Express та дізналися як він працює
навчилися створювати простий вебсервіс
навчилися використовувати Middleware, в тому числі кастомні
ознайомилися із файловою структурою та змінними оточення

//========================================

MongoDB Atlas



База даних схожа на величезний склад, де ви зберігаєте ваші дані. MongoDB — база даних, де інформацію зберігають у вигляді документів, подібних на JSON об'єкти, у форматі дуже схожим на об'єкти JavaScript.

MongoDB надає можливість використання віддаленої (хмарної) бази даних за допомогою сервісу MongoDB Atlas. MongoDB Atlas дозволяє створити, налаштувати та керувати кластерами, не звертаючись до складної інфраструктури. Ти можеш моніторити та управляти кластером через інтерфейс вебпорталу, отримувати повідомлення про стан бази даних і навіть автоматично масштабувати кластер залежно від навантаження.



Кластер — це група серверів, які працюють разом, щоб база даних була доступною, надійною та забезпечувала швидкий доступ до інформації. Коли ми говоримо про кластер у MongoDB Atlas, це як раз такий величезний склад, але з додатковими можливостями.



Для того, щоб спростити і прискорити роботу із цією базою, спочатку створимо аккаунт в MongoDB Atlas.





Після створення бази даних нам потрібно зберігти інформацію для підключення до неї у файлі .env, щоб забезпечити безпеку чутливих даних та легко адаптувати наш додаток під різні середовища розробки. Це дозволить нам уникнути прямого включення конфіденційних деталей у код і спростить управління конфігурацією.



Якщо ми мали connection string такий:

 mongodb+srv://borismeshkovaws:12345678@cluster0.xpxkilq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0



то тоді файл .env виглядатиме ось так:

   // .env

   PORT=3000
   MONGODB_USER=borismeshkovaws
   MONGODB_PASSWORD=12345678
   MONGODB_URL=cluster0.xpxkilq.mongodb.net
   MONGODB_DB=students // в посиланні вище її нема, але ми можемо вказати конкретну БД, яку будемо використовувати.
										   // Вона вказується після MONGODB_URL між "/" і "?"



Не забудь після додавання нових змінних до файлу .env додати їх в перелік змінних файла .env.example



app.get('/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;

  // Check if the ID format is valid
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${contactId} not found`,
    });
  }

  // Check if the contact exists in the database
  const contact = await ContactsCollection.findById(contactId);
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${contactId} not found!`,
    });
  }

  // If both checks pass, return the contact
  res.status(200).json({
    status: 200,
    data: contact,
  });
});


==============================================================
СТВОРЕННЯ СОРТУВАННЯ

Для сортування спочатку створимо константу sortOrder для параметрів запиту:

// src/constants/index.js

**export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};**



Як і для пагінації, напишімо парсер квері параметрів для сортування:

// src/utils/parseSortParams.js

import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfStudent = [
    '_id',
    'name',
    'age',
    'gender',
    'avgMark',
    'onDuty',
    'createdAt',
    'updatedAt',
  ];

  if (keysOfStudent.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};



Цей парсер використовується для обробки та стандартизації параметрів сортування, які можуть бути вказані у запиті до сервера. Він складається з двох головних частин: parseSortOrder і parseSortBy.



Функція parseSortOrder приймає параметр sortOrder та перевіряє, чи відповідає він одному з відомих порядків сортування — або зростанню (ASC), або спаданню (DESC). Якщо вказаний порядок сортування входить до цього списку, функція повертає його. Якщо порядок сортування не відомий або відсутній, за замовчуванням функція встановлює порядок сортування на зростання (ASC).



Функція parseSortBy приймає параметр sortBy, який має вказувати поле, за яким потрібно виконати сортування в базі даних студентів. Вона перевіряє, чи входить дане поле до списку допустимих полів (наприклад, _id, name, age тощо).



Якщо поле входить до цього списку, вона повертає його. Якщо ж ні — за замовчуванням повертається поле _id.



Загальна функція parseSortParams, яка експортується з модуля, інтегрує обидві ці функції. Вона приймає об'єкт query, з якого витягує значення sortOrder та sortBy, передає їх на обробку у відповідні функції та повертає об'єкт із валідованими та готовими до використання параметрами для сортування. Це дозволяє забезпечити консистентність і надійність обробки запитів сортування, забезпечуючи, що сервер завжди працює з коректними та очікуваними даними.



Модифікуємо тепер код контролеру:



// src/controllers/students.js

import { parseSortParams } from '../utils/parseSortParams.js';

/* Решта коду файла */

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};



Модифікуємо код сервісу:



// src/services/students.js

import { SORT_ORDER } from '../constants/index.js';

/* Решта коду файла */

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};



Тепер ми маємо можливість сортувати результати запиту до бази даних студентів. Параметри sortOrder та sortBy, визначені зі значеннями за замовчуванням, дозволяють визначити порядок сортування та поле, за яким потрібно виконати сортування (_id за замовчуванням).



Під час виклику функції, studentsQuery — запит до бази даних, що ініціюється за допомогою StudentsCollection.find(), налаштовується так, що він тепер включає, окрім методів skip та limit (для реалізації пагінації), ще й метод sort. Цей метод дозволяє організувати записи за полем, вказаним у sortBy, у порядку, заданому

у sortOrder. Таке сортування дозволяє користувачам отримувати дані в порядку, який найкраще відповідає їхнім потребам, забезпечуючи більшу гнучкість та зручність у взаємодії з даними.



Невелике демо щодо того, як цей функціонал працює:


===================================================
СТВОРЕННЯ ФІЛЬТРІВ
Як і в попередніх випадках, напишемо парсер квері параметрів для фільтрації:

// src/utils/parseFilterParams.js

const parseGender = (gender) => {
  const isString = typeof gender === 'string';
  if (!isString) return;
  const isGender = (gender) => ['male', 'female', 'other'].includes(gender);

  if (isGender(gender)) return gender;
};

const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return;
  }

  return parsedNumber;
};

export const parseFilterParams = (query) => {
  const { gender, maxAge, minAge, maxAvgMark, minAvgMark } = query;

  const parsedGender = parseGender(gender);
  const parsedMaxAge = parseNumber(maxAge);
  const parsedMinAge = parseNumber(minAge);
  const parsedMaxAvgMark = parseNumber(maxAvgMark);
  const parsedMinAvgMark = parseNumber(minAvgMark);

  return {
    gender: parsedGender,
    maxAge: parsedMaxAge,
    minAge: parsedMinAge,
    maxAvgMark: parsedMaxAvgMark,
    minAvgMark: parsedMinAvgMark,
  };
};



Цей код включає функції для парсингу параметрів фільтрації, які можуть бути

використані для обробки запитів до бази даних, особливо коли мова йде про відбір даних на основі специфічних критеріїв. Кожна функція має своє спеціалізоване призначення.



Функція parseGender перевіряє, чи введене значення статі є рядком та чи входить воно до дозволеного списку значень (male, female, other). Якщо вхідне значення відповідає цим умовам, воно повертається; інакше функція повертає undefined, що може вказувати на відсутність чи невалідність даних.



Функція parseNumber призначена для перевірки, чи вхідний параметр є рядком, який можна перетворити в число. Вона спробує перетворити рядок на ціле число і поверне це число, якщо перетворення успішне і результат не є NaN (не число). Якщо перетворення не вдається, повертається undefined.



Функція parseFilterParams використовує ці дві функції для обробки різних параметрів, які можуть включати стать, вікові межі та середні оцінки (як максимальні, так і мінімальні значення). Вона приймає об'єкт query, з якого витягує ці параметри, обробляє їх через відповідні функції та збирає результати в один об'єкт, який включає оброблені та валідовані параметри. Це дозволяє забезпечити більш точний і цілеспрямований пошук в базі даних за заданими фільтрами.



Модифікуємо код контролера:



// src/controllers/students.js

import { parseFilterParams } from '../utils/parseFilterParams.js';

/* Решта коду файла */

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};



Модифікуємо код сервіса:

// src/services/students.js

/* Решта коду файла */

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where('gender').equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where('age').lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }

  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};



Частина коду, яка відповідає за фільтрацію в функції getAllStudents, дозволяє здійснювати вибірку студентів за певними критеріями, що передаються через об'єкт filter. Ця фільтрація реалізована через методи where, equals, lte (less than or equal to), та gte (greater than or equal to), які є частиною запитів до бази даних MongoDB через Mongoose.



Ось основні етапи фільтрації:

Фільтрація за статтю: Якщо в об'єкті filter передано параметр gender, запит до бази даних обмежується студентами, стать яких відповідає зазначеній.
Фільтрація за віком: Якщо вказано maxAge, вибірка обмежується студентами, вік яких не перевищує це значення. Аналогічно, minAge встановлює мінімальний віковий поріг.
Фільтрація за середньою оцінкою: Подібно до віку, maxAvgMark та minAvgMark використовуються для встановлення верхньої та нижньої межі середньої оцінки студентів, яких слід включити в результати.


Завдяки цій фільтрації можна здійснювати більш точний і цілеспрямований пошук студентів, який дозволяє ефективно керувати великими обсягами даних та забезпечувати користувачам саме ті результати, які відповідають їхнім запитам.



Тут стає в пригоді окремий квері білдер для запитів. Логіка по фільтрації таким чином одночасно застосовується як до основного запиту studentsQuery, так і до запиту для обрахунку кількості studentsCount.

Також ми можемо трохи покращити швидкодію нашого додатка за допомогою Promise.all():



// src/services/students.js

/* Решта коду файла */

/* Замість цього коду */

const studentsCount = await StudentsCollection.find()
  .merge(studentsQuery)
  .countDocuments();

const students = await studentsQuery
  .skip(skip)
  .limit(limit)
  .sort({ [sortBy]: sortOrder })
  .exec();

/* Ми можемо написати такий код */

const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);



Цей рефакторинг коду використовує підхід паралельної обробки запитів до бази даних за допомогою Promise.all, що дозволяє ефективніше використовувати ресурси і скоротити час відповіді сервера.



У початковій версії коду виконання двох асинхронних операцій відбувається послідовно: спочатку визначається кількість студентів (studentsCount), які відповідають заданим критеріям фільтрації, а потім витягуються самі студенти (students) з врахуванням пагінації та сортування. Кожен запит чекає завершення попереднього перед тим, як розпочати виконання, що може призвести до зайвих затримок, особливо при великій кількості даних.



У рефакторингованій версії коду, замість послідовного виконання, обидві операції запускаються одночасно. Promise.all приймає масив промісів і повертає новий проміс, який виконується, коли всі проміси в масиві успішно виконані. Результатом є масив результатів кожного з промісів у тому порядку, в якому вони були передані.



Цей підхід дозволяє зменшити загальний час очікування відповіді, оскільки час виконання відповіді буде дорівнює часу виконання найдовшого запиту в масиві, а не сумі часів кожного запиту. Такий підхід є оптимальним, коли операції незалежні одна від одної та можуть виконуватися паралельно без порушення логіки додатку.



Давайте тепер подивимось на пагінацію, фільтра та сортування разом:





parseFilterParams.js
javascript
Копіювати код

const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) => ['work', 'home', 'personal'].includes(contactType);
  
  if (isContactType(contactType)) return contactType;
};

export const parseFilterParams = (query) => {
  const { contactType } = query;
  const parsedContactType = parseContactType(contactType);

  return {
    contactType: parsedContactType,
  };
};
