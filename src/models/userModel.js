import mongoose from "mongoose";
import { userProfileModel } from "./userProfile.js";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    immutable: true,
    validators: {
      match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
    }
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Please enter phone number digits'],
    validators: {
      match: [/^\\d{ 8, 11}$/, 'Please add a valid phone number with 10 or 11 digits']
    }
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userprofile',
  },

  password: {
    type: String,
    required: true,
    validators: {
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.']
    }
  },

  verified: {
    type: Boolean,
    required: true,
    default: false
  },

  interests: [
    {
      type: Object,
      enum: ['Mentoring', 'Mentorship', 'Job opportunities', 'Fashion', 'Business/Finance', 'Tech/IT', 'Entertainment', 'News', 'Academics', 'Travel', 'Gaming', 'Politics', 'Music', 'Arts', 'Culture', 'Design'],
      required: [true, 'Please pick your interests'],
      default: 'Entertainment'
    }
  ],

  isMentor: {
    type: Boolean,
    default: false
  },

  isMentee: {
    type: Boolean,
    default: false
  },

  followers: [{ type: Object }],

  following: [{ type: Object }],

  tokens: [{ type: Object }]

})

export const userModel = mongoose.model('User', userSchema);