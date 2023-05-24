import express from 'express';
import { createAccount, emailLogin } from '../controllers/userControllers.js';

const router = express.Router();

// user registration or create account
router.post('/create-account', createAccount);
router.post('/email-login', emailLogin);

export { router as userRouter };