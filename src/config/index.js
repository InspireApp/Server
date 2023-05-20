import { development } from "./development.js";
import dotenv from dotenv;
import { production } from "./production.js";
dotenv.config();

const environment = process.env.NODE_ENV;

let config;
if (!environment) throw new Error("No environment specified");

console.log(`server is running in the ${environment} environment`);

if (environment.trim() === "development") {
  config = { ...development };
}

if (environment.trim() === "production") {
  config = { ...production };
}

export { config };