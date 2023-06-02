import * as bcrypt from 'bcrypt';
import { isValidObjectId } from "mongoose";
import { sendError } from "../error/customError.js";
import { verifyToken } from "../utils/jwt.js";
import { userModel } from "../models/userModel.js";
import { resetTokenModel } from "../models/resetToken.js";

export const userAuthJwt = async (req, res, next) => {
  try {
    // check if there is token in the request header
    if (req.header('auth_token')) {
      const token = req.header('auth_token');
      if (!token) return res.status(401).json({ message: 'Access denied, you need a token' });

      // if there is a token in the request header
      const verified = verifyToken(token);
      // console.log(verified);
      const user = await userModel.findById(verified._id)
      // console.log(user);
      if (!user) return sendError(res, 401, 'unauthorized access');

      req.user = user;
      // console.log(req.user);
      next();

    } else { //using sessions
      if (!req.user) {
        return sendError(res, 400, "Session invalid, please try login again!")    //res.redirect('/api/v1/auth/email-login')
      } else {
        next();
      }
    }



  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token' });
  }

}

export const socialAuthCheck = (req, res, next) => {


}

export const resetPasswordValidation = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || !id) return sendError(res, 400, "Invalid request");

  // check if id object is valid or not
  if (!isValidObjectId(id)) return sendError(res, 400, "Invalid user!");

  // check if the user with id exists
  const user = await userModel.findById(id);
  if (!user) return sendError(res, 400, "user not found!");

  const resetToken = await resetTokenModel.findOne({ owner: user._id });
  if (!resetToken) return sendError(res, 400, "Reset token not found!");

  const isValid = await bcrypt.compare(token, resetToken.token)
  if (!isValid) return sendError(res, 400, "Please provide a valid token!")

  req.user = user;
  next();
}
