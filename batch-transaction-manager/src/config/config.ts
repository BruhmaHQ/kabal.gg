import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(8080),
    PG_HOST: Joi.string().required().description('PostgreSQL host'),
    PG_USER: Joi.string().required().description('PostgreSQL username'),
    PG_PASSWORD: Joi.string().required().description('PostgreSQL password'),
    PG_DATABASE: Joi.string().required().description('PostgreSQL database name'),
    PG_PORT: Joi.number().default(5432).description('PostgreSQL port')
  })
  .unknown();

  const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  pg: {
    host: envVars.PG_HOST,
    user: envVars.PG_USER,
    password: envVars.PG_PASSWORD,
    database: envVars.PG_DATABASE,
    port: envVars.PG_PORT,
  },
};


