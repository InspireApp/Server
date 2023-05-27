import mongoose from "mongoose";

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
  password: {
    type: String,
    required: true,
    validators: {
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:']
    }
  },

  profilePic: {
    type: String,
    default: ""
  },

  verified: {
    type: Boolean,
    required: true,
    default: false
  },

  tokens: [{ type: Object }]

})

export const userModel = mongoose.model('User', userSchema);