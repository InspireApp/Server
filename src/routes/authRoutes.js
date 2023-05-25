import express from 'express';
import { createAccount, emailLogin, forgotPassword, resetPassword, verifyEmail } from '../controllers/authControllers.js';
import { resetPasswordValidation, userAuth } from '../middlewares/auth.js';

const router = express.Router();

// user registration or create account
router.post('/create-account', createAccount);
router.post('/verify-email', verifyEmail);
router.post('/email-login', emailLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);




export { router as userAuthRouter };