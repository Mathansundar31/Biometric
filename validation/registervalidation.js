const Joi = require('joi');

// Registration validation schema
const UserRegisterSchema = Joi.object({
  FirstName: Joi.string()
    .min(2)
    .max(50)
    .required(),

  LastName: Joi.string()
    .min(0)
    .max(50)
    .required(),

  Email: Joi.string()
    .email()  
    .required(),

  Password: Joi.string()
    .min(8)  // Minimum length for security
    //.pattern(/(?=.*[A-Z])(?=.*\d)/)  // At least one uppercase letter and one number
    .required(),

  Address: Joi.string()
        .min(5)
        .max(100)
        .required(),

  MobileNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)  // Adjust regex for your requirements
        .required(),

  Gender: Joi.string()
    .valid('male', 'female', 'other')  
    .required(),
    
   Role: Joi.string()
    .valid('Admin', 'employee', 'customer')
    .required()
   
});

// Login validation schema
const loginSchema = Joi.object({
  Email: Joi.string()
    .email()  
    .required(),

  Password: Joi.string()
    .min(8)  // Minimum length for security
    .required(),
});

const changePasswordSchema = Joi.object({
    Email: Joi.string().email().required(),
    CurrentPassword: Joi.string().min(8).required(),
    NewPassword: Joi.string().min(8).required()
});

module.exports = {
  UserRegisterSchema,
  loginSchema,
  changePasswordSchema
};

