import { sendError } from "../error/customError.js";
import { JobModel } from "../models/jobModel.js";
import {
  addJobValidator,
  updateJobValidator,
} from "../validators/jobValidator.js";
import { mongoIdValidator } from "../validators/mongoIdValidator.js";

export const createJob = async (req, res) => {
  try {
    // collect data from the logged in user(req.user) and collect data from the req.body
    const userId = req.user._id;

    const userEmail = req.user.email;

    // Validate req.body data???

    const {
      jobTitle,
      companyName,
      jobType,
      jobCategory,
      jobLocation,
      applicationDeadline,
      jobDescription,
      contactInfor,
      applicationInstruction,
    } = req.body;

    // create new job
    const job = await JobModel.create({
      userJob: userId,
      email: userEmail,
      jobTitle,
      companyName,
      jobType,
      jobCategory,
      jobLocation,
      applicationDeadline,
      jobDescription,
      contactInfor,
      applicationInstruction,
    });
    if (!job) return sendError(res, 400, "Please add job");

    // server response
    res.status(200).json({
      status: "success",
      message: "Job added successfully",
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const findJob = async (req, res) => {
  try {
    const { id } = req.query
    const { error } = mongoIdValidator.validate(req.query)
    if( error ) return sendError(res, 404, 'Please pass in a valid mongoId');

    const getJob = await JobModel.findById(id)
    if(!getJob) return sendError(`The task with this id: ${id}, does not exist`)

    // server response
    res.status(200).json({
      status: "success",
      message: "Job details found successfully",
      data:  getJob ,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};



export const findAllJobs = async (req, res) => {
  try {

      // filtering by job properties
      const queryObj = { ...req.query };
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach(el => delete queryObj[el]);

      // after all operations on queryObj, pass to JobModel
      let query = JobModel.find(queryObj);
  
      // populate the query response with job info from the  collection excluding the password
      query = query.populate({ path: 'userJob', select: '-password' });
  
      // pagination
      if (req.query.page && req.query.limit) {
        const page = req.query.page * 1 || 1;  //page 1 is default
        const limit = req.query.limit * 1 || 5;
        const skip = (page - 1) * limit
  
        query = query.skip(skip).limit(limit);
  
        const numOfJobs = await JobModel.countDocuments();
        if (skip >= numOfJobs) return sendError(res, 400, "This page is not available!")
      }
  
      // finally, await query
      const allJobs = await query;
  
      // if error and no profile, send error
      if (!allJobs) return sendError(res, 404, 'jobs not found!');

    // server response
    return res.status(200).json({
      message:
        allJobs.length < 1
          ? "No job details found"
          : "Job details found successfully",
      status: "Success",
      data: {
        allJobs,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};



export const updateJob = async (req, res) => {
  try {
    const { id } = req.query

    const { error } = mongoIdValidator.validate(req.query)
    if( error ) return sendError(res, 404, 'Please pass in a valid mongoId');

    const getJob = await JobModel.findById(id)
    if(!getJob) return sendError(`The task with this id: ${id}, does not exist`)
    
    // data to be updated from req.body
    const updatingJobValidator = await updateJobValidator(req.body);
    const updateJobError = updatingJobValidator.error;
    if (updateJobError) throw updateJobError;

    const job = await JobModel.findById(id);
    if (!job) return sendError(res, 400, `Job with this id: ${id}, does not exist`);

    // update specific user job info using jobModel
    const updatedJob = await JobModel.findByIdAndUpdate(id, req.body, { new: true,});

    // if userJob info not updated, send error
    if (!updatedJob) return sendError(res, 400, "Job not updated!");

    // server response
    res.status(200).json({
      status: "success",
      message: "Job updated successfully",
      data: { updatedJob },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.query;
    const { error } = mongoIdValidator.validate(req.query);
    if (error) return sendError(res, 400, "Please pass in a valid mongoId");

    const job = await JobModel.findById(id);
    if (!job) return sendError(res, 404, `The task with this id: ${id}, does not exist`);

    // await userProfileModel.deleteOne({ _id: userId });
    await JobModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  

    return res.status(200).json({
      message: "Job deleted successfully",
      status: "Success",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
