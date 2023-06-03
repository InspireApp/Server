import express from "express"
import { createJob, findJob, findAllJobs, updateJob, deleteJob } from "../controllers/jobController.js"
import { userAuthJwt} from "../middlewares/auth.js"

const router = express.Router()

router.post("/create-job", userAuthJwt, createJob)
router.get("/job-details", userAuthJwt, findJob)
router.get("/all-jobs-details", findAllJobs)
router.put("/update-job-details", userAuthJwt, updateJob)
router.delete("/delete-job", userAuthJwt, deleteJob)


export {router as jobRouter}