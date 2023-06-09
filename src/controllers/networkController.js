import { sendError } from "../error/customError.js";
import { userModel } from "../models/userModel.js";

export const follow = async (req, res) => {
  try {
    const userId = req.user.id;
    const follow_Id = req.body._id;

    const userExists = await userModel.findById(follow_Id)
    if(!userExists) return sendError(res, 400,`user with this id: ${follow_Id}, does not exist`);

    // object that specifies how the followers should updated
    const followers = await userModel.findByIdAndUpdate(
      follow_Id,
      {
        $push: { followers: userId },
      },
      { new: true }
    );

    // object that specifies that the updated document should be returned and not the original document

    const following = await userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: { following: follow_Id },
        },
        { new: true }
      )
      .select("-password");

    // server response
    res.status(200).json({
      status: "success",
      message: "followers array updated successfully",
      data1: followers,
      data2: following,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};


 export const unfollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const unfollowId = req.body.unfollowId;

    // object that specifies how the followers should updated
    const followers = await userModel.findByIdAndUpdate(
      unfollowId,
      {
        $pull: { followers: userId },
      },
      { new: true }
    );

    // object that specifies that the updated document should be returned and not the original document

    const following = await userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { following: unfollowId },
        },
        { new: true }
      )
      .select("-password");

    // server response
    res.status(200).json({
      status: "success",
      message: "followers array updated successfully",
      data1: followers,
      data2: following,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};


//block user
export const blockUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    userModel.updateOne(
      { _id: userId },
      { $set: { blocked: true } },
    )
     // server response
     res.status(200).json({
      status: "success",
      message: "user blocked successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};
