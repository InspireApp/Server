import { development } from "./development.js";
import * as dotenv from 'dotenv';
import { production } from "./production.js";
dotenv.config();

const environment = process.env.NODE_ENV;
console.log(environment);

let config;
if (!environment) throw new Error('No environment specified')

console.log(`server is running in the ${environment} environment`);

if (environment === "development") {
  config = { ...development };
}

if (environment === "production") {
  config = { ...production };
}

export { config };