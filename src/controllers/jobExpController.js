import { isValidObjectId } from "mongoose";
import { sendError } from "../error/customError.js";
import { userModel } from "../models/userModel.js";
import { userProfileModel } from "../models/userProfile.js"

export const updateOneJobExperience = async (req, res) => {
  try {
    // collect id from req.params
    const jobId = req.params.jobId;
    if (!isValidObjectId(jobId)) return sendError(res, 400, "job object Id invalid!")

    const isMatch = await userProfileModel.find({ jobExperience: { $elemMatch: req.body } });
    if (isMatch.length) return sendError(res, 400, "experience already saved!");

    // update job experience by its object id
    const updatedJob = await userProfileModel.findOneAndUpdate(
      { "jobExperience._id": jobId },
      { $set: { 'jobExperience.$': req.body } },
      { new: true }
    ).populate({
      path: 'userProfile',
      select: '-password -tokens -__v'
    });

    // if no updatedJob send error
    if (!updatedJob) return sendError(res, 400, 'Error occurred while updating experience, probably due to wrong job object Id!')

    // server response
    res.status(200).json({
      status: 'success',
      message: 'experience updated successfully',
      data: { updatedJob }
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}

export const addOneNewMentExperience = async (req, res) => {
  try {
    const createdUserProfileId = req.params.userProfileId;
    console.log(createdUserProfileId);

    const isMatch = await userProfileModel.find({ mentorshipExperience: { $elemMatch: req.body } })
    if (isMatch.length) return sendError(res, 400, "experience already saved!");

    const newMentExp = await userProfileModel.findByIdAndUpdate({ _id: createdUserProfileId }, { $push: { mentorshipExperience: req.body } }, { new: true })
      .populate({
        path: 'userProfile',
        select: '-password -tokens -__v'
      });

    if (!newMentExp) return sendError(res, 400, "no new mentorship experience added, check the created profile Id!")

    // server response
    res.status(200).json({
      status: 'success',
      message: 'experience added successfully',
      data: { newMentExp }
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}

// pull or delete one mentorship exp
export const removeOneMentorshipExperience = async (req, res) => {
  try {
    const removeId = req.params.userProfileId;

    const isMatch = await userProfileModel.find({ mentorshipExperience: { $elemMatch: req.body } })
    if (!isMatch.length) return sendError(res, 400, "experience not available!");

    const remMentExp = await userProfileModel.findByIdAndUpdate({ _id: removeId }, { $pull: { mentorshipExperience: req.body } }, { new: true })
      .populate({
        path: 'userProfile',
        select: '-password -tokens -__v'
      });

    if (!remMentExp) return sendError(res, 400, "experience not removed!")

    // server response
    res.status(200).json({
      status: 'success',
      message: 'experience removed successfully',
      data: { remMentExp }
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}
