import Joi from "joi"

import JoiMongoId from "joi-objectid"

Joi.objectId = JoiMongoId(Joi)
//Joi.string().regex(/^[0-9a-fA-F]{24}$/) = JoiMongoId(Joi)

export const mongoIdValidator = Joi.object({
  id: Joi.objectId()
  //id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)

}).strict()