import createHttpError from 'http-errors';
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
// import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
   const { page, perPage } = parsePaginationParams(req.query);
    const contacts = await getAllContacts({
    page,
    perPage,
  });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  // // Додаємо обробку помилки валідації id
  // if (!mongoose.Types.ObjectId.isValid(contactId)) {
  //   return res.status(404).json({
  //     status: 404,
  //     message: "Invalid contact ID format!",
  //   });
  // }

  const contact = await getContactById(contactId);
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
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  })
}

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  // // Додаємо обробку помилки валідації id
  // if (!mongoose.Types.ObjectId.isValid(contactId)) {
  //   return res.status(404).json({
  //     status: 404,
  //     message: "Invalid contact ID format!",
  //   });
  // }

  const contact = await deleteContact(contactId);
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
  const result = await updateContact(contactId, req.body);

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

