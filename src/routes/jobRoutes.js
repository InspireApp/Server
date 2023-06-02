import {Router} from "express"
import { createJob, filterJobs, findJob, findAllJobs } from "../controllers/jobController.js"
import { userAuthJwt} from "../middlewares/auth.js"

const router = Router()

router.post("/create-job", userAuthJwt, createJob)
router.get("/search-job", filterJobs)
router.get("/job-details", findJob)
router.get("/user-job-details", findAllJobs)


export {router as jobRouter}