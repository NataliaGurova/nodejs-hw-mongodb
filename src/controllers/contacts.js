import createHttpError from 'http-errors';
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
// import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

    const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
};


export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);
  	// Додаємо базову обробку помилки
  if (!contact) {
    // 2. Створюємо та налаштовуємо помилку
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};


export const createContactController = async (req, res) => {
  // const { body } = req;
  const avatar = req.file;

  let url;

  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      url = await saveFileToCloudinary(avatar);
    } else {
      url = await saveFileToUploadDir(avatar);
    }
  };

  const contact = await createContact({ ...req.body, avatar: url }, req.user._id);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  })
};


export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);
  // Додаємо базову обробку помилки
  if (!contact) {
    // 2. Створюємо та налаштовуємо помилку
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.sendStatus(204);
  // res.status(204).send();
};


export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const avatar = req.file;
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

    let url;

 if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      url = await saveFileToCloudinary(avatar);
    } else {
      url = await saveFileToUploadDir(avatar);
    }
  };

const result = await updateContact(contactId, {
    ...req.body,
    avatar: url,
  }, userId);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  };

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

