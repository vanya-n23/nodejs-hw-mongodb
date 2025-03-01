import { ContactsCollections } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  return await ContactsCollections.find();
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
