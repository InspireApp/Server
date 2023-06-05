import joi from "joi"

export const addJobValidator = (data) => {
  const schema = joi.object({
    
  jobTitle:  joi.string().required(),

  companyName: joi.string().required(),

  jobType: joi.string().required(),

  jobCategory: joi.string().required(),

  jobLocation: joi.string().required(),

  applicationDeadline: joi.string().required(),

  jobDescription: joi.string().required(),

  contactInfor: joi.string().required(),

  applicationInstruction: joi.string().required(),

  }).strict();

  return schema.validate(data);
}

export const updateJobValidator = (data) => {
  const schema = joi.object({  
    jobTitle:  joi.string().optional(),

    companyName: joi.string().optional(),
  
    jobType: joi.string().optional(),
  
    jobCategory: joi.string().optional(),
  
    jobLocation: joi.string().optional(),
  
    applicationDeadline: joi.string().optional(),
  
    jobDescription: joi.string().optional(),
  
    contactInfor: joi.string().optional(),
  
    applicationInstruction: joi.string().optional(),
  
  
  }).strict();

  return schema.validate(data);
}

 export const findJobsValidator = (data) => {
  const schema = joi.object({  
    jobTitle:  joi.string().optional(),

    companyName: joi.string().optional(),
  
    jobType: joi.string().optional(),
  
    jobCategory: joi.string().optional(),
  
    jobLocation: joi.string().optional(),
  
  }).strict();

  return schema.validate(data);
}
