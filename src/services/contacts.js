import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollections } from '../db/models/contacts.js';
import { calculateData } from '../utils/calculatePages.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  console.log('user', userId);

  const contactsQuery = ContactsCollections.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite === true) {
    contactsQuery.where('isFavourite').equals(true);
  } else if (filter.isFavourite === false) {
    contactsQuery.where('isFavourite').equals(false);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollections.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);
  const paginationData = calculateData(contactsCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async ({ _id, userId }) => {
  return await ContactsCollections.findOne({ _id, userId });
};

export const createContact = async (payload) => {
  return await ContactsCollections.create(payload);
};

export const deleteContact = async ({ contactId, userId }) => {
  const contact = await ContactsCollections.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return contact;
};

export const updateContact = async (conditions, payload) => {
  const rawResult = await ContactsCollections.findOneAndUpdate(
    conditions,
    { $set: payload },
    { new: true },
  );
  if (!rawResult) return null;

  return rawResult;
};
