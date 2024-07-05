
=================================
// src/controllers/auth.js

import { generateAuthUrl } from '../utils/googleOAuth2.js';

/* Інший код файлу */

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};
// src/routers/auth.js

import { getGoogleOAuthUrlController } from '../controllers/auth.js';

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

----------------------
// src/utils/googleOAuth2.js

import createHttpError from 'http-errors';

/* Інший код файлу */

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};

У функції validateCode в полі response.tokens.id_token буде ****лежати jwt токен, який ми можемо розшифрувати як за допомогою бібліотеки jsonwebtoken, так і за допомогою метода verifyIdToken з нашого клієнта. Краще слідувати рекомендаціям Google і скористатися їх спеціалізованим методом.



В результаті ми отримаємо loginTicket, з якого зможемо за допомогою методу getPayload() дістати закодовані дані. Далі на основі тих даних, що у нас присутні в payload ми або створюємо користувача, або використовуємо вже існуючого і логінимо його за допомогою нашого механізму сессій.
-----------------------------


Опишемо це в сервісній функції loginOrSignupWithGoogle :

// src/services/auth.js

import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';

/* Інший код файлу */

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};



Створимо контролер:

// src/controllers/auth.js

import { loginOrSignupWithGoogle } from '../services/auth.js';

/* Інший код файлу */

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};



Створимо схему для валідації:

// src/validation/auth.js

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});



Оскільки ми маємо все, що нам потрібно, давайте створимо роут:

// src/routers/auth.js

import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';

/* Інший код файлу */

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);



================= 7 =============
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import path from 'path';
import { env } from './env.js';
import { GOOGLE } from '../constants/index.js';
import createHttpError from 'http-errors';

const googleConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'google.json')).toString(),
);

const client = new OAuth2Client({
  clientId: env(GOOGLE.CLIENT_ID),
  clientSecret: env(GOOGLE.CLIENT_SECRET),
  project_id: googleConfig.web.project_id,
  redirectUri: googleConfig.web.redirect_uris[0],
});

export const generateOAuthURL = () => {
  return client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  const response = await client.getToken(code);

  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await client.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';

  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};

----

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(crypto.randomBytes(10), 10);

    user = await User.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  await Session.deleteOne({ userId: user._id });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

------------------


export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);

  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
----setupSession Cookies----

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
};
