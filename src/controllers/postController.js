import mongoose from 'mongoose';
import { postModel } from "../models/postModel.js"
import { userModel } from "../models/userModel.js";
// import { uploadImageToCloudinary } from '../utils/imageConv.js';
// import fs from 'fs';
// import { URL } from 'url';



export const createPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { desc, images } = req.body;

    // const filePath = new URL('./profile.jpeg', import.meta.url).pathname;
    // console.log(filePath);


    // const images = fs.readFileSync(filePath, (err, data) => {
    //   if (err) {
    //     console.error('Error reading file:', err);
    //     return;
    //   }

    //   // Process the file data
    //   // console.log('File contents:', data);
    //   return data;
    // });

    // // image to cloudinary
    // const imageUrl = uploadImageToCloudinary(images);
    // console.log(imageUrl);

    const newPost = await postModel.create({ userId, desc, images });

    res.status(200).json({
      status: "success",
      message: "post created!",
      data: { newPost }
    })

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.postId
    const onePost = await postModel.findById(postId);

    res.status(200).json({
      status: "success",
      message: "One user post",
      data: { onePost }
    })

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}

export const updatePost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { postId } = req.body;

    const post = await postModel.findById({ _id: postId });

    if (post.userId === userId) {
      const updatedPost = await postModel.findByIdAndUpdate({ _id: postId }, { $set: req.body }, { new: true });
      res.status(200).json({
        status: "success",
        message: "post updated",
        data: { updatedPost }
      })
    }
    else {
      res.status(403).json({
        message: "Action forbidden"
      })
    }

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { postId } = req.body;

    const post = await postModel.findById({ _id: postId });
    if (post.userId === userId) {
      const deletePost = await postModel.findByIdAndDelete({ _id: postId },);
      res.status(200).json({
        status: "success",
        message: "post deleted"
      });
    } else {
      res.status(400).json({
        message: "post not deleted"
      })
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}

export const likePost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { postId } = req.body;

    const post = await postModel.findById({ _id: postId });
    if (!post.likes.includes(userId)) {
      const likePost = await postModel.findByIdAndUpdate({ _id: postId }, { $push: { likes: userId } }, { new: true });

      res.status(200).json({
        status: "success",
        message: "post liked",
        data: { likePost }
      })
    } else {
      const dislikePost = await postModel.findByIdAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true });

      res.status(200).json({
        status: "success",
        message: "post disliked",
        data: { dislikePost }
      })
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}

// get timeline post which is the post of the user and the people the user is following
export const getTimeLinePost = async (req, res) => {
  try {
    const userId = req.params.userId;

    const currentUserPosts = await postModel.findOne({ userId });
    console.log(currentUserPosts);
    const followingPosts = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts"
        }
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        }
      }
    ])
    const posts = followingPosts[0].followingPosts.concat(currentUserPosts)
    res.status(200).json({
      timeLine: posts.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    });

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}