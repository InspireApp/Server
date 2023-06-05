import { isValidObjectId } from "mongoose";
import { sendError } from "../error/customError.js";
import { userModel } from "../models/userModel.js";
import { userProfileModel } from "../models/userProfile.js"

export const createProfile = async (req, res) => {
  try {
    // collect data from the logged in user(req.user) and collect data from the req.body
    const userId = req.user._id;

    const userEmail = req.user.email;

    // Validate req.body data???

    const { profilePic, gender, bio, jobRole, jobRoleCategory, education, jobExperience, mentorshipExperience } = req.body

    // check if profile exists
    const existingProfile = await userProfileModel.findOne({ userProfile: userId });
    if (existingProfile) return sendError(res, 400, "User profile exists, thank you!");

    // create new user profile
    const userProfiles = await userProfileModel.create({ userProfile: userId, email: userEmail, profilePic, gender, bio, jobRole, jobRoleCategory, education, jobExperience, mentorshipExperience })
    if (!userProfiles) return sendError(res, 400, "Please create your profile");

    // populate the user collection with the user userProfile details
    const updatedUserProfile = await userProfileModel.findOne({ userProfile: userId }).populate({
      path: 'userProfile',
      select: '-password -tokens -__v'
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
    query = query.populate({ path: 'userProfile', select: '-password -tokens -__v' });

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
        select: '-password -tokens -__v'
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
    const updatedUser = await userModel.findByIdAndUpdate(userId, { fullName, phoneNumber }, { new: true, runValidators: true }).select('-password -tokens -__v');

    // if user info not updated, send error
    if (!updatedUser) return sendError(res, 400, "user info not updated!")

    // update specific user profile info using userProfileModel
    const updatedUserProfile = await userProfileModel.findByIdAndUpdate(profileId, { profilePic, bio, jobRole, jobRoleCategory }, { new: true }).populate({
      path: 'userProfile',
      select: '-password -tokens -__v'
    });

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

// collect interest handler
export const updateInterest = async (req, res) => {
  try {

    // collect interests from req.body
    const interest = req.body;

    // userProfile id if from req.params
    const profileId = req.params.userProfileId;

    // update the interest path in the with user-model
    const updateInterestQuery = await userModel.findByIdAndUpdate({ _id: req.user._id }, { interests: interest }, { new: true });

    // if updateInterestQuery is not present
    if (!updateInterestQuery) return sendError(res, 400, "Interests not updated!");

    // find the users profile by userprofile model and populate
    const updatedUserProfile = await userProfileModel.findById({ _id: profileId }).populate({
      path: 'userProfile',
      select: '-password -tokens -__v'
    });
    console.log(updatedUserProfile);

    // if updatedUserProfile is not present
    if (!updatedUserProfile) return sendError(res, 400, "User profile not updated!");

    // server response
    res.status(200).json({
      status: 'success',
      message: 'user info or profile updated',
      profile: { updatedUserProfile }
    })


  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}

export const followUser = async (req, res) => {
  try {

    // the user's id is gotten from the req.user._id, that of the person to be followed from req.body.followId.add id of the user to the followed user's followers
    const result = await userModel.findByIdAndUpdate(req.body.followId, { $push: { followers: req.user._id } }, { new: true }).select("-password");

    // if no result, send error
    if (!result) sendError(res, 400, "Unable to follow at the moment");

    // also append the id of the followed to the followers - following
    const result2 = await userModel.findByIdAndUpdate(req.user._id, { $push: { following: req.body.followId } }, { new: true }).select("-password");

    // if no result, send error
    if (!result) sendError(res, 400, "Operation ot successful");

    // server response
    res.status(200).json({
      status: 'success',
      message: 'user followed successfully',
      // profile: { updatedUserProfile }
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}

export const unFollowUser = async (req, res) => {
  try {

    // the user's id is gotten from the req.user._id, that if the person to be un-followed from req.body.unFollowId. remove id of the user from the un-followed user's followers
    const result = await userModel.findByIdAndUpdate(req.body.unFollowId, { $pull: { followers: req.user._id } }, { new: true }).select("-password");

    // if no result, send error
    if (!result) sendError(res, 400, "Unable to follow at the moment");

    // also remove the id of the un-followed from the user's following
    const result2 = await userModel.findByIdAndUpdate(req.user._id, { $pull: { following: req.body.unFollowId } }, { new: true }).select("-password");

    // if no result, send error
    if (!result) sendError(res, 400, "Operation ot successful");

    // server response
    res.status(200).json({
      status: 'success',
      message: 'user un-followed successfully',
      // profile: { updatedUserProfile }
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