import { Router } from "express";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
import { loginUserController, logoutUserController, refreshUserSessionController, registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
// import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

// router.use(authenticate);

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);


router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);


router.post('/logout', ctrlWrapper(logoutUserController));


router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;