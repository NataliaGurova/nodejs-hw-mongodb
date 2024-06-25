
import { SORT_ORDER } from "../constants/index.js";
import { ContactCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  // пагінація
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find({userId});

  // фільтри
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // // Замість цього коду
  // const contactsCount = await ContactCollection.find()
  //   .merge(contactsQuery)
  //   .countDocuments();

  // const contacts = await contactsQuery
  //   .skip(skip)
  //   .limit(limit)
  //   .sort({ [sortBy]: sortOrder })
  //   .exec();

/* Ми можемо написати такий код */

const [contactsCount, contacts] = await Promise.all([
  ContactCollection.find().merge(contactsQuery).countDocuments(),
  contactsQuery
  .skip(skip)
  .limit(limit)
  .sort({ [sortBy]: sortOrder })
  .exec(),
]);
/* -------------------------- */

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };

}

export const getContactById = (contactId, userId) => ContactCollection.findOne({
    _id: contactId,
    userId,
  });

export const createContact = (payload, userId) => ContactCollection.create({
    ...payload,
    userId,
  });

export const deleteContact = (contactId, userId) => ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

export const updateContact = async (contactId, payload, userId, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
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
