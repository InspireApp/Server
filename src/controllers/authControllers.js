import * as bcrypt from 'bcrypt';
import { loginValidator, userDataValidation } from '../validators/joiValidator.js';
import { userModel } from '../models/userModel.js';
import { config } from '../config/index.js';
import { generateToken } from '../utils/jwt.js';
import { sendError } from '../error/customError.js';
import { createRandomBytes, generateEmail, generateOTP, generatePasswordReset, mailTransport, passwordResetConfirm, responseEmail } from '../utils/mailOTP.js';
import { tokenVerificationModel } from '../models/tokenVerificationModel.js';
import { isValidObjectId } from 'mongoose';
import { resetTokenModel } from '../models/resetToken.js';

export const createAccount = async (req, res) => {

  try {
    // Validate user registration data (joi validation)
    const { error, value } = userDataValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: "Failed",
        message: error.details[0].message
      });
    }

    // destructure the data in the req.body
    const { fullName, email, phoneNumber, password } = req.body;

    // check if the email already exists
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: "Failed",
        message: 'Email already exists, please login instead'
      });
    }

    // hash password before saving to database
    const saltPass = +config.bcrypt_password_salt_round
    const hashedPassword = await bcrypt.hashSync(password, saltPass);

    // save data into the database
    const userCreated = await userModel.create({ fullName, email, phoneNumber, password: hashedPassword });

    // generate an otp for user
    const OTP = generateOTP();

    // hash otp
    const saltOTP = +config.bcrypt_OTP_salt_round
    const hashedOTP = await bcrypt.hashSync(OTP, saltOTP);

    // save hashed token generated into the verification-tokens collections, token is valid for 1 hour
    const tokenVerification = await tokenVerificationModel.create({ owner: userCreated._id, token: hashedOTP })

    // send OTP mail
    mailTransport().sendMail({
      from: "elizabethwaleade@gmail.com",
      to: userCreated.email,
      subject: "verify your email account",
      html: generateEmail(OTP, userCreated.fullName)
    })

    // returned response
    res.status(200).json({
      status: 'Success',
      message: 'User registered successfully',
      userData: userCreated,
      verificationToken: tokenVerification
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}

export const emailLogin = async (req, res) => {

  try {
    // Validate user registration data (joi validation)
    const { error, value } = loginValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // destructure the data in the req.body
    const { email, password } = req.body;

    // check if the user exists by email
    const userExists = await userModel.findOne({ email });
    if (!userExists) return sendError(res, 400, 'Email does not exist, please signup');

    // check if the password matches database
    const passwordExist = await bcrypt.compare(password, userExists.password);
    if (!passwordExist) return sendError(res, 400, 'password incorrect or does not exist.')

    // check if the user is verified
    if (userExists.verified === false) return sendError(res, 400, "Please verify your account!")

    // if user already has a token and token valid, do not generate new token


    // generate token
    const token = generateToken(userExists);

    let oldTokens = userExists.tokens || [];
    if (oldTokens.length) {
      oldTokens = oldTokens.filter(t => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000
        if (timeDiff < 86400) {
          console.log(t);
          return t;
        } else {
          return {};
        }
      })
    }


    await userModel.findByIdAndUpdate(userExists._id, { tokens: [...oldTokens, { token, signedAt: Date.now().toString() }] }, { runValidators: true })

    // when everything is checked successfully
    res.status(200).header('auth_token', token).json({
      status: 'Success',
      message: 'User logged in successfully',
      access_token: token
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}

export const verifyEmail = async (req, res) => {
  try {

    // verify by email and OTP
    const { email, otp } = req.body;

    if (!email || !otp) return sendError(res, 400, "Invalid request, enter email");

    // // verifying valid user-id using isValidObjectId from mongoose
    // if (!isValidObjectId(userId)) return sendError(res, 400, "Invalid user id!")

    // find user by email
    const userFound = await userModel.findOne({ email });
    if (!userFound) return sendError(res, 400, "User not found!, Please create an account");

    // check if user is verified
    if (userFound.verified) return sendError(res, 400, "This account is already verified, please login!");

    // check if there is token in the token verification model, else generate token and send token to email.

    // retrieve token from token verification collections in the database by userFound._id
    const token = await tokenVerificationModel.findOne({ owner: userFound._id });

    // compare the token from req.body to token stored in the database
    const isMatched = await bcrypt.compare(otp, token.token);

    if (!isMatched) return sendError(res, 400, "Please provide a valid token!");

    // when everything seems to work fine, then set the verified property in the user collection database to true.
    userFound.verified = true;

    // then save the updated userFound document
    const updateUser = await userModel.create(userFound);

    // After verification is complete, delete the user verification document in the database
    await tokenVerificationModel.findByIdAndDelete(token._id);

    // send verification mail
    mailTransport().sendMail({
      from: "elizabethwaleade@gmail.com",
      to: userFound.email,
      subject: "Welcome Email",
      html: responseEmail(userFound.fullName)
    })

    // response
    res.status(200).json({
      message: "User verified successfully",
      data: updateUser
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}

export const laterAccountVerify = async (req, res) => {
  try {

    const { email } = req.body;
    if (!email) return sendError(res, 400, "Invalid request, enter email");

    const userFound = await userModel.findOne({ email })
    if (!userFound) return sendError(res, 400, "User not found!, Please create an account")

    // check if user is verified
    if (userFound.verified) return sendError(res, 400, "This account is already verified, please login!");

    // generate an otp for user
    const OTP = generateOTP();

    // hash otp
    const saltOTP = +config.bcrypt_OTP_salt_round
    const hashedOTP = await bcrypt.hashSync(OTP, saltOTP);

    // save hashed token generated into the verification-tokens collections, token is valid for 1 hour
    await tokenVerificationModel.create({ owner: userFound._id, token: hashedOTP })

    // send OTP mail
    mailTransport().sendMail({
      from: "emailverification@gmail.com",
      to: userFound.email,
      subject: "verify your email account",
      html: generateEmail(OTP, userFound.fullName)
    })

    // response
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email",
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;
    if (!email) return sendError(res, 400, "Please provide a valid email");

    // find a user with the email provided
    const user = await userModel.findOne({ email });
    if (!user) return sendError(res, 400, "User not found, invalid request");

    // check if the resetToken document exists
    const token = await resetTokenModel.findOne({ owner: user._id })
    if (token) return sendError(res, 400, "try again after 1 hour");

    // generate a random token from crypto
    const genToken = await createRandomBytes()

    // hash token generated
    const tokenSalt = +config.bcrypt_forgot_password_salt_round
    const hashedToken = await bcrypt.hashSync(genToken, tokenSalt);

    // create the reset-token document in the database
    const resetToken = await resetTokenModel.create({ owner: user._id, token: hashedToken })

    // send mail
    mailTransport().sendMail({
      from: "elizabethwaleade@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: generatePasswordReset(user.fullName, `http://localhost:3000/reset-password?token=${genToken}&id=${user._id}`)
    })

    // response
    res.status(200).json({
      status: "success",
      message: "Password reset link is sent to your email",
      data: resetToken
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}

export const resetPassword = async (req, res) => {

  try {

    const { password } = req.body;
    const user = await userModel.findById(req.user._id)
    if (!user) return sendError(res, 400, "user not found!");

    // check if it is same password as old password
    const isSamePassword = await bcrypt.compare(password, user.password)
    if (isSamePassword) return sendError(res, 400, "Cannot have the same password as the old one.");

    // check the length of the password
    if (password.trim().length < 8 || password.trim().length > 20) return sendError(res, 400, "Password must be 8 to 20 characters long!");

    // hash password
    const saltPass = +config.bcrypt_password_salt_round;
    const hashedPassword = await bcrypt.hashSync(password.trim(), saltPass);

    // update the new password
    user.password = hashedPassword;

    // save the new updated user object
    const updatedResetPassword = await userModel.create(user);

    // delete reset token document from database
    await resetTokenModel.findOneAndDelete({ owner: user._id });

    // send mail
    mailTransport().sendMail({
      from: "elizabethwaleade@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: passwordResetConfirm(user.fullName)
    })

    // response
    res.status(200).json({
      status: "success",
      message: "Password reset successful",
      data: updatedResetPassword
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}

export const logOut = async (req, res) => {

  try {

    if (req.headers.auth_token) {
      if (req.headers && req.headers.auth_token) {
        const token = req.headers.auth_token
        if (!token) {
          return sendError(res, 401, 'Authorization failed!')
        }
        const tokens = req.user.tokens;
        const newTokens = tokens.filter(t => t.token !== token)

        await userModel.findByIdAndUpdate(req.user._id, { tokens: newTokens })
        res.status(200).json({ message: 'signed out successfully' })

      }
    } else {
      if (req.user) {
        req.logout();
        res.status(200).json({ message: 'signed out successfully' })
      }
    }

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}