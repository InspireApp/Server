import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  desc: String,

  likes: [],

  images: String
},
  {
    timestamps: true
  })

export const postModel = mongoose.model('Post', postSchema);