import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  userJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  jobTitle: {
    type: String,
    required: true,
  },

  companyName: {
    type: String,
    required: true,
  },

  jobType: {
    type: String,
    required: true,
  },
  jobCategory: {
    type: String,
    required: true,
  },

  jobLocation: {
    type: String,
    required: true,
  },

  applicationDeadline: {
    type: Date,
    default: Date.now(),
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  jobDescription: {
    type: String,
    required: true,
  },

  contactInfor: {
    type: String,
    required: true,
  },

  applicationInstruction: {
    type: String,
    required: true,
  },
  jobLink: {
    type: String,
    default: ""
  },

});

jobSchema.pre(/^find/, function (next){
  if (this instanceof mongoose.Query) {
      this.where({ isDeleted: { $ne: true } }); 
    }  
    next()
  })
  

export const JobModel = mongoose.model("Job", jobSchema);
