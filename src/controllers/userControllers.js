import * as bcrypt from 'bcrypt';
import { loginValidator, userDataValidation } from '../validators/joiValidator.js';
import { userModel } from '../models/userModel.js';
import { config } from '../config/index.js';
import { generateToken } from '../utils/jwt.js';
import { sendError } from '../error/customError.js';
import { generateEmail, generateOTP, mailTransport, responseEmail } from '../utils/mailOTP.js';
import { tokenVerificationModel } from '../models/tokenVerificationModel.js';
import { isValidObjectId } from 'mongoose';

export const createAccount = async (req, res) => {
  try {
    // Validate user registration data (joi validation)
    const { error, value } = userDataValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // destructure the data in the req.body
    const { fullName, email, phoneNumber, password } = req.body;

    // check if the email already exists
    const emailExists = await userModel.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'Email already exists, please login instead' });

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

    const tokenVerification = await tokenVerificationModel.create({ owner: userCreated._id, token: hashedOTP })

    // send OTP mail
    mailTransport().sendMail({
      from: "emailverification@gmail.com",
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

    // when everything is checked successfully
    res.status(200).header('auth_token', generateToken(userExists)).json({
      status: 'Success',
      message: 'User logged in successfully',
      access_token: generateToken(userExists)
    })

  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    })
  }

}

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) return sendError(res, 400, "Invalid request, missing required parameters");

  // verifying valid user-id using isValidObjectId from mongoose
  if (!isValidObjectId(userId)) return sendError(res, 400, "Invalid user id!")

  // find user by id
  const userFound = await userModel.findById(userId)
  if (!userFound) return sendError(res, 400, "Sorry not found!")

  // check if user is verified
  if (userFound.verified) return sendError(res, 400, "This account is already verified");

  // retrieve token from token verification collections in the database by userFound._id
  const token = await tokenVerificationModel.findOne({ owner: userFound._id })
  if (!token) return sendError(res, 400, "Sorry, user not found")

  // compare the token from req.body to token stored in the database
  const isMatched = await bcrypt.compare(otp, token.token)
  if (!isMatched) return sendError(res, 400, "Please provide a valid token!")

  // when everything seems to work fine, then set the verified property in the user collection database to true.
  userFound.verified = true;

  // After verification is complete, delete the user verification document in the database
  await tokenVerificationModel.findByIdAndDelete(token._id)

  // then save the updated userFound document
  const updateUser = await userModel.create(userFound);

  // send OTP mail
  mailTransport().sendMail({
    from: "emailverification@gmail.com",
    to: userFound.email,
    subject: "Welcome Email",
    html: responseEmail(userFound.fullName)
  })

  // response
  res.status(200).json({
    message: "User verified successfully",
    data: updateUser
  })
}