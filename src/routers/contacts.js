import { Router } from 'express';
import {
    getContactsController,
    getContactByIdController,
    createContactController,
    deleteContactController,
    patchContactController,
  } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';


const router = Router();

  router.use(authenticate);

  // router.use('/:contactId', isValidId('contactId'))  // щоб не вставляти до кожного роутера

  router.get('/', ctrlWrapper(getContactsController));

  router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
  );

  router.post(
  '/',
  validateBody(createContactSchema),
  upload.single('avatar'), // додаємо цю middleware
  ctrlWrapper(createContactController),
);

  router.patch(
    '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  upload.single('avatar'), // додаємо цю middleware
  ctrlWrapper(patchContactController),
  );

  router.delete('/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController));

export default router;
