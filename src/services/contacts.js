
import { ContactCollection } from "../db/models/contact.js";

export const getAllContacts = () => ContactCollection.find();

export const getContactById = (contactId) => ContactCollection.findById(contactId);

export const createContact = (payload) => ContactCollection.create(payload);

export const deleteContact = (contactId) => ContactCollection.findByIdAndDelete(contactId);

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}
