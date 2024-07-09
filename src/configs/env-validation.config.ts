import Joi from 'joi';

export const ConfigModuleValidationSchema = Joi.object({
  SERVER_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required().default(3000),
  DB_PORT: Joi.number().required().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().required().default(true),
  PASSWORD_HASH_ROUNDS: Joi.number().required().default(10),
  JWT_SECRET: Joi.string().required(),
});
