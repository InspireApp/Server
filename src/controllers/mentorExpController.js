import { isValidObjectId } from "mongoose";
import { sendError } from "../error/customError.js";
import { userModel } from "../models/userModel.js";
import { userProfileModel } from "../models/userProfile.js"

export const updateOneMenExperience = async (req, res) => {
  try {
    // collect id from req.params
    const menExpId = req.params.menExpId;
    if (!isValidObjectId(menExpId)) return sendError(res, 400, "mentorship object Id invalid!")

    const isMatch = await userProfileModel.find({ mentorshipExperience: { $elemMatch: req.body } });
    if (isMatch.length) return sendError(res, 400, "experience already saved!");

    // update mentorship experience by its object id
    const menExp = await userProfileModel.findOneAndUpdate(
      { "mentorshipExperience._id": menExpId },
      { $set: { 'mentorshipExperience.$': req.body } },
      { new: true }
    ).populate({
      path: 'userProfile',
      select: '-password -tokens -__v'
    });

    // if no mentorshipExp send error
    if (!menExp) return sendError(res, 400, 'Error occurred while updating experience, probably due to wrong education object Id!')

    // server response
    res.status(200).json({
      status: 'success',
      message: 'experience updated successfully',
      data: menExp
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}

// export const addOneNewEducationExperience = async (req, res) => {
//   try {
//     const createdUserProfileId = req.params.userProfileId;
//     console.log(createdUserProfileId);

//     const isMatch = await userProfileModel.find({ education: { $elemMatch: req.body } })
//     if (isMatch.length) return sendError(res, 400, "experience already saved!");

//     const newEducation = await userProfileModel.findByIdAndUpdate({ _id: createdUserProfileId }, { $push: { education: req.body } }, { new: true })
//       .populate({
//         path: 'userProfile',
//         select: '-password -tokens -__v'
//       });

//     if (!newEducation) return sendError(res, 400, "no new Education experience added, check the created profile Id!")

//     // server response
//     res.status(200).json({
//       status: 'success',
//       message: 'experience added successfully',
//       data: newEducation
//     })

//   } catch (error) {
//     res.status(500).json({
//       status: 'Failed',
//       message: error.message
//     })
//   }
// }

// // pull or delete one job exp
// export const removeOneEducationExperience = async (req, res) => {
//   try {
//     const removeId = req.params.userProfileId;

//     const isMatch = await userProfileModel.find({ education: { $elemMatch: req.body } })
//     if (!isMatch.length) return sendError(res, 400, "experience not available!");

//     const remEducation = await userProfileModel.findByIdAndUpdate({ _id: removeId }, { $pull: { education: req.body } }, { new: true })
//       .populate({
//         path: 'userProfile',
//         select: '-password -tokens -__v'
//       });

//     if (!remEducation) return sendError(res, 400, "experience not removed!")

//     // server response
//     res.status(200).json({
//       status: 'success',
//       message: 'experience removed successfully',
//       data: remEducation
//     })

//   } catch (error) {
//     res.status(500).json({
//       status: 'Failed',
//       message: error.message
//     })
//   }
// }