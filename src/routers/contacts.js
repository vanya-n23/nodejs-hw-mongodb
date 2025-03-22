import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createValidationShema,
  updateValidationShema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  validateBody(createValidationShema),
  ctrlWrapper(createContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateValidationShema),
  ctrlWrapper(updateContactController),
);

export default router;
