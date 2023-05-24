import * as bcrypt from 'bcrypt';
import { loginValidator, userDataValidation } from '../validators/joiValidator.js';
import { userModel } from '../models/userModel.js';
import { config } from '../config/index.js';
import { generateToken } from '../utils/jwt.js';
import { sendError } from '../error/customError.js';

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
    const salt = +config.bcrypt_salt_round
    const hashedPassword = await bcrypt.hashSync(password, salt);

    // save data into the database
    const userCreated = await userModel.create({ fullName, email, phoneNumber, password: hashedPassword });

    // returned response
    res.status(200).json({
      status: 'Success',
      message: 'User registered successfully',
      data: userCreated
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