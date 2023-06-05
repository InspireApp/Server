import express from 'express';
import { createProfile, deleteUserProfile, followUser, getAllProfile, getOneProfile, unFollowUser, updateInterest, updateUserInfoAndProf } from '../controllers/profileController.js';
import { userAuthJwt } from '../middlewares/auth.js';
import { updateOneEducationExperience, addOneNewEducationExperience, removeOneEducationExperience } from '../controllers/educationExpController.js';
import { updateOneJobExperience } from '../controllers/jobExpController.js';
import { updateOneMenExperience } from '../controllers/mentorExpController.js';

const router = express.Router();

// profile routes
router.post('/create-profile', userAuthJwt, createProfile);
router.get('/all-profile', getAllProfile);
router.get('/one-profile', userAuthJwt, getOneProfile);
router.put('/update-user-or-profile/:userProfileId', userAuthJwt, updateUserInfoAndProf);
router.delete('/deleteUserProfile/:createdUserProfileId', userAuthJwt, deleteUserProfile);

// updating education routes
router.patch('/update-education-experience/:educationId', userAuthJwt, updateOneEducationExperience);
router.patch('/update-new-education-experience/:userProfileId', userAuthJwt, addOneNewEducationExperience);
router.patch('/update-remove-education-experience/:userProfileId', userAuthJwt, removeOneEducationExperience);

// updating job routes
router.patch('/update-job-experience/:jobId', userAuthJwt, updateOneJobExperience);

// updating mentorship experience routes
router.patch('/update-men-experience/:menExpId', userAuthJwt, updateOneMenExperience);

// update interest route
router.patch('/update-interest/:userProfileId', userAuthJwt, updateInterest);

// follow and un-follow user route
router.patch('/follow-user', userAuthJwt, followUser);
router.patch('/unFollow-user', userAuthJwt, unFollowUser);

export { router as userProfileRouter };