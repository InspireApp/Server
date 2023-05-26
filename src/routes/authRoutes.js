import express from 'express';
import { createAccount, emailLogin, forgotPassword, logOut, resetPassword, verifyEmail } from '../controllers/authControllers.js';
import { resetPasswordValidation, socialAuthCheck, userAuthJwt } from '../middlewares/auth.js';
import passport from 'passport';

const router = express.Router();

// user registration or create account
router.post('/create-account', createAccount);
router.post('/verify-email', verifyEmail);
router.post('/email-login', emailLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/logout', userAuthJwt, logOut)


// social login routes
router.get('/google', passport.authenticate("google", { scope: ['profile'] }));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => res.redirect('/api/v1/auth/'));
router.get('/', userAuthJwt, (req, res) => { res.status(200).json({ message: 'You are logged in, Welcome to the homepage!' }) })
// router.get('/logout-session', userAuthJwt, logOut)



export { router as userAuthRouter };