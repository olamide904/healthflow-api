import Joi from 'joi';

const envSchema = Joi.object({
    PORT: Joi.number().integer().min(1000).max(9999).required(),
    MONGO_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().min(36).required()
})
.unknown();

const { error, value } = envSchema.validate(process.env,
    {
        abortEarly: false,
    });

if(error) {
    throw new Error(`env validation error: ${error.message}` );
}

const env = value;


export default env;