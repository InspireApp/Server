import * as dotenv from "dotenv";
import express from "express";
import mongoose from 'mongoose';
import morgan from "morgan";
import { globalErrorHandler } from "./src/utils/globalError.js";
import { config } from "./src/config/index.js";
import { userRouter } from "./src/routes/UserRoutes.js";

dotenv.config();
const app = express();
const port = config.port;

// global middle-wares
app.use(express.json())
app.use(morgan('tiny'))

// Mounting router
app.use('/api/v1/user', userRouter);

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