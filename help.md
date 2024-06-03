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
