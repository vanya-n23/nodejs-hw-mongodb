import SORT_ORDER from '../constants/index.js';
import { ContactsCollections } from '../db/models/contacts.js';
import { calculateData } from '../utils/calculatePages.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollections.find();

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

export const getContactById = async (contactId) => {
  return await ContactsCollections.findById(contactId);
};

export const createContact = async (payload) => {
  return await ContactsCollections.create(payload);
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollections.findByIdAndDelete({
    _id: contactId,
  });
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const rawResult = await ContactsCollections.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );
  if (!rawResult) return null;

  return rawResult;
};
