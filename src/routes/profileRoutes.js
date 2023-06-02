import express from 'express';
import { createProfile, deleteUserProfile, getAllProfile, getOneProfile, updateUserInfoAndProf } from '../controllers/profileController.js';
import { userAuthJwt } from '../middlewares/auth.js';
import { updateOneEducationExperience, addOneNewEducationExperience, removeOneEducationExperience } from '../controllers/educationExpController.js';

const router = express.Router();

// profile routes
router.post('/create-profile', userAuthJwt, createProfile);
router.get('/all-profile', getAllProfile);
router.get('/one-profile', userAuthJwt, getOneProfile);
router.put('/update-user-or-profile/:userProfileId', userAuthJwt, updateUserInfoAndProf);
router.delete('/deleteUserProfile/:createdUserProfileId', userAuthJwt, deleteUserProfile);

// updating education,job and mentorship experience routes
router.patch('/update-education-experience/:educationId', userAuthJwt, updateOneEducationExperience);
router.patch('/update-new-education-experience/:userProfileId', userAuthJwt, addOneNewEducationExperience);
router.patch('/update-remove-education-experience/:userProfileId', userAuthJwt, removeOneEducationExperience);

export { router as userProfileRouter };