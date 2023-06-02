import { sendError } from "../error/customError.js";
import { userModel } from "../models/userModel.js";
import { userProfileModel } from "../models/userProfile.js"

export const createProfile = async (req, res) => {
  try {
    // collect data from the logged in user(req.user) and collect data from the req.body
    const userId = req.user._id;

    const userEmail = req.user.email;

    // Validate req.body data???

    const { firstName, lastName, profilePic, gender, bio, jobRole, jobRoleCategory, education, jobExperience, mentorshipExperience } = req.body

    // check if profile exists
    const existingProfile = await userProfileModel.findOne({ userProfile: userId });
    if (existingProfile) return sendError(res, 400, "User profile exists, thank you!");

    // create new user profile
    const userProfiles = await userProfileModel.create({ userProfile: userId, firstName, lastName, email: userEmail, profilePic, gender, bio, jobRole, jobRoleCategory, education, jobExperience, mentorshipExperience })
    if (!userProfiles) return sendError(res, 400, "Please create your profile");

    // populate the user collection with the user userProfile details
    const updatedUserProfile = await userProfileModel.findOne({ userProfile: userId }).populate({
      path: 'userProfile',
      select: '-password'
    });

    // // update the users collection with the updated profile
    // const userCreatedProfile = await userModel.findByIdAndUpdate({ _id: userId }, updateUserProfile, { new: true });

    // server response
    res.status(200).json({
      status: "success",
      message: "user profile created",
      data: { updatedUserProfile }
    });

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }
}

// this route handler is only for super user, who has access to pull up all user data, not for single users
export const getAllProfile = async (req, res) => {
  try {
    // filtering by user profile properties
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // after all operations on queryObj, pass to userProfileModel
    let query = userProfileModel.find(queryObj);

    // populate the query response with userinfo from the user's collection excluding the password
    query = query.populate({ path: 'userProfile', select: '-password' });

    // pagination
    if (req.query.page && req.query.limit) {
      const page = req.query.page * 1 || 1;  //page 1 is default
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit

      query = query.skip(skip).limit(limit);

      const numOfProfiles = await userProfileModel.countDocuments();
      if (skip >= numOfProfiles) return sendError(res, 400, "This page is not available!")
    }

    // finally, await query
    const allUserProfile = await query;

    // if error and no profile, send error
    if (!allUserProfile) return sendError(res, 404, 'Users profile not found!');

    // server response
    res.status(200).json({
      status: "success",
      message: "All user profile",
      data: { allUserProfile }
    });

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }
}

export const getOneProfile = async (req, res) => {
  try {
    // collect id from logged in user's details
    const userId = req.user._id;

    // get one profile using the user profile model and populate with user info from user's collection, excluding the password
    const getOneProfile = await userProfileModel.findOne({ userProfile: userId })
      .populate({
        path: 'userProfile',
        select: '-password'
      });

    // if no profile, send error
    if (!getOneProfile) return sendError(res, 400, 'user profile not found!')

    // server response
    res.status(200).json({
      status: "success",
      message: "user profile",
      data: { getOneProfile }
    });

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }
}

export const updateUserInfoAndProf = async (req, res) => {
  try {
    // user id from login details
    const userId = req.user._id;

    // userProfile id if from req.params
    const profileId = req.params.userProfileId;

    // data to be updated from req.body
    const { firstName, lastName, phoneNumber, profilePic, bio, jobRole, jobRoleCategory } = req.body;

    const fullName = firstName + " " + lastName;

    // update specific user info using userModel and run validators
    const updatedUser = await userModel.findByIdAndUpdate(userId, { fullName, phoneNumber }, { new: true, runValidators: true });

    // if user info not updated, send error
    if (!updatedUser) return sendError(res, 400, "user info not updated!")

    // update specific user profile info using userProfileModel
    const updatedUserProfile = await userProfileModel.findByIdAndUpdate(profileId, { profilePic, bio, jobRole, jobRoleCategory }, { new: true });

    // if userProfile info not updated, send error
    if (!updatedUserProfile) return sendError(res, 400, "user Profile not updated!");

    // server response
    res.status(200).json({
      status: 'success',
      message: 'user info or profile updated',
      info: updatedUser,
      profile: { updatedUserProfile }
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}

// delete user profile
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.createdUserProfileId;

    const userExists = await userProfileModel.findById({ _id: userId });
    if (!userExists) return sendError(res, 400, "User profile not found!")

    await userProfileModel.deleteOne({ _id: userId });

    res.status(204).json({
      status: "success",
      message: "user profile deleted"
    })


  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}