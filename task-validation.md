Крок 1



Створіть гілку hw4-validation з гілки hw3-crud і виконуйте це завдання в гілці hw4-validation.



Крок 2



Покращіть обробку вхідних даних (валідацію) у вашому додатку. Для цього:

Створіть функцію validateBody, яка буде приймати аргументом схему валідації, а повертати буде middleware для валідації body запиту.
Додайте валідацію до роутів POST /contacts та PATCH /contacts/:contactId. Побудуйте схеми валідації, базуючись на тому, як ви описали властивості моделі MongoDB. Окрім цього, для полів типу string додайте правила мінімальної довжини - 3 символи, та максимальної довжини - 20 символів.


Крок 3



Додайте пагінацію до маршруту GET /contacts. Для цього використовуйте такі query параметри запиту:

page - номер сторінки запиту (за замовчуванням 1)
perPage - кількість елементів на сторінці (за замовчуванням 10)


Відповідь сервера у властивості data має містити такі властивості:

data - містить масив контактів з поточної сторінки
page - вказує на номер поточної сторінки
perPage - визначає кількість елементів на сторінці
totalItems - вказує на загальну кількість елементів в колекції
totalPages - визначає загальну кількість сторінок
hasPreviousPage - відображає чи є попередня сторінка
hasNextPage - відображає чи є наступна сторінка


Відповідь сервера має бути наступного формату:

{
    "status": 200,
    "message": "Successfully found contacts!",
    "data": {
        "data": [/* contacts */],
        "page": 2,
        "perPage": 4,
        "totalItems": 6,
        "totalPages": 2,
        "hasPreviousPage": true,
        "hasNextPage": false
    }
}



Крок 4



Додайте можливість задати порядок сортування елементів за іменем контакту в відповіді для маршруту GET /contacts. Для цього використовуйте такі query параметри запиту:

sortBy - визначає, за якою властивістю потрібно робити сортування
sortOrder - визначає порядок сортування (asc - висхідний порядок сортування (значення за замовчуванням) або desc - низхідний порядок сортування)


Крок 5 (не обов’язковий)



За бажанням додайте можливість фільтрації контактів за типом, властивістю isFavourite у відповіді для маршруту GET /contacts. Для цього використовуйте такі query параметри запиту:

type - відображає тип контакту, значення властивості contactType
isFavourite - відображає чи є контакт обраним


Крок 6



Поміняйте гілку, з якої зараз деплоїться ваш проєкт на render.com, на hw4-validation. Переконайтеся, що зміни успішно задеплоєні

=============================
 "_id": "665dba7ce4262439565ca92e",
            "name": "Yulia Shevchenko",
            "phoneNumber": "+380000000004",
            "email": null,
            "isFavourite": false,
            "contactType": "personal",
            "createdAt": "2024-05-08T16:12:14.954Z",
            "updatedAt": "2024-05-08T16:12:14.954Z"

===============================

// src/controllers/students.js

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

/* Решта коду файла */

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const students = await getAllStudents({
    page,
    perPage,
  });

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

====================
Ми також винесли частину логіки, яка обраховує інформацію про пагінацію, в окрему утиліту, оскільки надалі вона може стати в пригоді при роботі з іншими ресурсами.



Функція calculatePaginationData повертає об'єкт з повною інформацією про пагінацію, включно з поточною сторінкою, кількістю елементів на сторінці, загальною кількістю елементів, загальною кількістю сторінок, індикаторами наявності наступної та попередньої сторінок.



Це дозволяє клієнтській частині застосунку коректно управляти навігацією сторінок відповідно до наявних даних.

// src/utils/calculatePaginationData.js

export const calculatePaginationData = (count, perPage, page) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};



Залишилось додати до сервісу логіку для того, щоб правильно запитувати дані з бази даних:

// src/services/students.js

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

/* Решта коду файла */

export const getAllStudents = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};



Тепер сервісна функція getAllStudents приймає об'єкт з параметрами page та perPage, що вказують номер сторінки та кількість записів на сторінці відповідно.



Функція getAllStudents спочатку розраховує зміщення (skip), що дорівнює кількості записів, що мають бути пропущені перед початком видачі на поточній сторінці. Вона також розраховує ліміт записів, які мають бути повернуті на одній сторінці.



Далі, функція ініціює запит до бази даних для отримання списку студентів, використовуючи спеціальні методи skip та limit для застосування пагінації. Паралельно, вона робить запит для визначення загальної кількості студентів за допомогою методу countDocuments.



Після отримання списку студентів і загальної кількості, функція викликає calculatePaginationData, яка обраховує і повертає дані для пагінації, зокрема інформацію про загальну кількість сторінок і чи є наступна чи попередня сторінка.



Результатом виконання функції є об'єкт, що містить масив з даними про студентів і додаткову інформацію про пагінацію, що дозволяє клієнту легко навігувати між сторінками результатів.



Пропонуємо подивитися на пагінацію в дії:

