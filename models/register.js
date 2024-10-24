const mongoose = require('mongoose');
//const { default: Register } = require('../../frontend/src/componts/Register');

const UserRegisterSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50  
    },
     
    LastName: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50  
    },

    Email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/  
    },

    Password: {
        type: String,
        required: true
    },
    
    Address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },

    MobileNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,  // Example: Matches a 10-digit number
    },
    
    Gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },

    Role: {
       type: String,  
       required: true,
       enum: ['Admin','employee','customer']
     }
});

const Register = mongoose.model('Register', UserRegisterSchema);

module.exports = Register;
