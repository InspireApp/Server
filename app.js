import * as dotenv from "dotenv";
import express from "express";
import mongoose from 'mongoose';
import morgan from "morgan";
import { globalErrorHandler } from "./src/utils/globalError.js";
import { config } from "./src/config/index.js";
import { userAuthRouter } from "./src/routes/authRoutes.js";
import { passportSetup } from "./src/socialLogin/passport.js";
import cookieSession from "cookie-session";
import passport from "passport";
import { userProfileRouter } from "./src/routes/profileRoutes.js";
import { jobRouter } from "./src/routes/jobRoutes.js";
// import { homePageRouter } from "./src/routes/homePageRoutes.js";

dotenv.config();
const app = express();
const port = config.port || 3001;

// global middle-wares
app.use(express.json())
app.use(morgan('tiny'))

// call passport file
passportSetup();

// cookieSession for passport
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [config.cookie_session_key]
}))


// initialize passport
app.use(passport.initialize())
app.use(passport.session())




// Mounting router
app.use('/api/v1/auth', userAuthRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/profile', userProfileRouter);
// app.use('/api/v1', homePageRouter);


// Database connection
mongoose.connect(config.mongodb_connection_url)
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.log(err.message));



// globalErrorHandler middle-ware
app.use(globalErrorHandler)

// server setup
app.listen(port, () => {
  console.log(`App listening on PORT: ${port}`);
});