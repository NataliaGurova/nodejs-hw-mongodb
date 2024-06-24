import { ONE_DAY, THIRTY_DAY } from "../constants/index.js";
import { loginUser, logoutUser, refreshUsersSession, registerUser } from "../services/auth.js";



export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    // data: user,
    data: {email: user.email, name: user.name},
  });
};


const setupCookiesSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  // далі ми створюємо cookie
  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + ONE_DAY),
  // });
  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + ONE_DAY),
  // });

  setupCookiesSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};


export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupCookieSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


