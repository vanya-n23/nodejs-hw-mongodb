import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  resetPasswordController,
  resetTokenController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createUserSchema,
  loginSchema,
  loginWithGoogleAuthSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/user.js';

const router = Router();

router.post(
  '/register',
  validateBody(createUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(resetTokenController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;