import {
  addJobValidator,
  filterJobValidator,
} from "../validators/jobValidator.js";
import { mongoIdValidator } from "../validators/mongoIdValidator.js";
import { JobModel } from "../models/jobModel.js";
import {
  sendError,
  NotFoundError,
  BadUserRequestError,
} from "../error/customError.js";
import { userModel } from "../models/userModel.js";

export const createJob = async (req, res) => {
  try {
    // Validate user job creation data (joi validation)
    const { error } = addJobValidator(req.body);
    if (error) {
      return res.status(400).json({
        status: "Failed",
        message: error.details[0].message,
      });
    }

    // save job data into the database
    const newJob = await JobModel.create({ ...req.body, owner: req.user._id });

    // returned response
    res.status(200).json({
      status: "Success",
      message: "Job Added Successfully",
      userData: newJob,
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
    // destructuring req.query data
    const { id } = req.query;

    // joi validation
    const { error } = mongoIdValidator.validate(req.query);
    if (error) throw new BadUserRequestError("Please pass in a valid mongoId");

    //retrieve job from the database
    const job = await JobModel.findById(id);
    if (!job)
      throw new NotFoundError(`The job with this id: ${id}, does not exist`);

    return res.status(200).json({
      status: "Success",
      message: "Job details found successfully",
      data: { job },
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
    const _id = req.params._id;
    console.log(req.params._id)
    //joi validation
    const { error } = mongoIdValidator.validate(req.query);
    if (error) throw new BadUserRequestError("Please pass in a valid mongoId");

    //retrieving user from the database
    const user = await userModel.findById(_id);
    if (!user)
      throw new NotFoundError(`The user with this id: ${_id}, does not exist`);

    // user's created jobs from the database
    const jobs = await JobModel.find({ user: _id }).populate("owner");

    //response
    return res.status(200).json({
      message:
        tasks.length < 1
          ? "No job details found"
          : "Job details found successfully",
      status: "Success",
      data: {
        jobs,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const filterJobs = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) - 1 || 0;
    // const limit = parseInt(req.query.limit) || 5;
    // const search = req.query.search || "";
    // let sort = req.query.sort || "companyName";
    // let jobType = req.query.sort || "All";

    //  let jobLocation = req.query.sort ||"All"
    //  let applicationDeadline = req.query.sort ||"all"
    //  let jobDescription = req.query.sort ||"all"
    //  let companyName = req.query.sort ||"all"

    const jobs = await JobModel.find().skip(0).limit(5);


    // jobType === "All"
    //   ? (jobType = [JobModel])
    //   : (jobType = req.query.jobTitle.split(","));

    // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    // let sortBy = {};
    // if (sort[1]) {
    //   sortBy[sort[0]] = sort[1];
    // } else {
    //   sortBy[sort[0]] = "asc";
    // }

    // const jobs = await JobModel.find({
    //   jobTittle: { $regex: search, $options: "i" },
    // })
    //   .where("jobType")
    //   .in([...jobType])
    //   .sort(sortBy)
    //   .skip(page * limit)
    //   .limit(limit);

    // const total = await JobModel.countDocuments({
    //   jobtype: { $in: [...jobType] },
    //   companyName: { $regex: search, $options: "i" },
    // });

    // response

    // res.status(200).json({
    //   status: "success",
    //   message: "searches found",
    //   data: {
    //     total,
    //     page: page + 1,
    //     limit,
    //     jobType: JobModel,
    //     companyName,
    //   },
    // });

    res.status(200).json({
      status: "success",
      message: "searches found",
      data: {
        jobs
      },
    });

  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};
