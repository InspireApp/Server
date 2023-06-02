import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  profilePic: {
    type: String,
    default: ""
  },

  gender: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    required: true
  },

  jobRole: {
    type: String,
    required: true,
  },

  education: [
    {
      institution: {
        type: String,
        required: [true, 'Please enter name of School']
      },
      started: {
        type: Number,
        required: [true, 'please enter start year']
      },
      ended: {
        type: Number,
        required: [true, 'please enter start year']
      },
    },
  ],

  jobExperience: [
    {
      company: {
        type: String,
        default: ""
      },
      started: {
        type: Number,
        required: [true, 'please enter start year']
      },
      ended: {
        type: Number,
        required: [true, 'please enter end year']
      }
    },

  ],

  mentorshipExperience: [
    {
      field: {
        type: String,
        default: ""
      },
    }
  ]

})

export const userProfileModel = mongoose.model('Userprofile', userProfileSchema);