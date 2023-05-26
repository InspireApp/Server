import mongoose from "mongoose";

const googleSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  }

})

export const googleModel = mongoose.model('Googleuser', googleSchema);