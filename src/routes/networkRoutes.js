import express from "express"
import { follow, unfollow } from "../controllers/networkController.js"
import { userAuthJwt} from "../middlewares/auth.js"

const router = express.Router()

router.post("/follow", userAuthJwt, follow)

router.put("/unfollow", userAuthJwt, unfollow)

export {router as networkRouter}