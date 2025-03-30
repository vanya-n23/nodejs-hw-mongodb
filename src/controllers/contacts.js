import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user._id,
  });

  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    throw createHttpError(403, `you do not have access`);
  }
  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  if (!req.user || !req.user._id) {
    throw createHttpError(401);
  }

  let urlPhoto;

  if (req.file) {
    urlPhoto =
      getEnvVar('ENABLE_CLOUDINARY') === 'true'
        ? await saveFileToCloudinary(req.file)
        : await saveFileToUploadDir(req.file);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: urlPhoto,
  });

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact({
    _id: contactId,
    userId: req.user._id,
  });

  if (!contact) {
    next(createHttpError(404, 'Not found'));
    return;
  }

  res.status(204).send();
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  let urlPhoto;

  if (req.file) {
    urlPhoto =
      getEnvVar('ENABLE_CLOUDINARY') === 'true'
        ? await saveFileToCloudinary(req.file)
        : await saveFileToUploadDir(req.file);
  }

  const updatedContact = await updateContact(
    {
      _id: contactId,
      userId: req.user._id,
    },
    {
      ...req.body,
      photo: urlPhoto,
    },
  );

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
