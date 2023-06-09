import express from "express";
import {
  follow,
  unfollow,
  blockUser,
} from "../controllers/networkController.js";
import { userAuthJwt } from "../middlewares/auth.js";

const router = express.Router();

router.post("/follow", userAuthJwt, follow);

router.put("/unfollow", userAuthJwt, unfollow);

router.put("/block-user/:userId", userAuthJwt, blockUser);

export { router as networkRouter };
