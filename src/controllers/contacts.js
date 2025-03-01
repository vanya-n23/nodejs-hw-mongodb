import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact with id: ${contactId} not found`);
  }
  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  console.log('req.body', req.body);
  const contact = await createContact(req.body);

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Not found'));
    return;
  }

  res.status(204).send();
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    next(createHttpError(404, 'Not found'));
    return;
  }
  res.send({
    status: 200,
    message: 'Successfully update contact',
    data: updatedContact,
  });
};
