const User = require('../models/register');
//const Feedback = require('../models/Feedback')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { UserRegisterSchema, loginSchema, changePasswordSchema } = require('../validation/registervalidation');

// Nodemailer setup
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mathankpr48@gmail.com',  
        pass: 'oevn cdwg rbmm rxaa'  
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Create a new user
const createUser = async (req, res) => {
    // Validate data before creating a user
    const { error } = UserRegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { FirstName, LastName, Gender, Email, Password, Role, Address, MobileNumber } = req.body;

    try {
        let user = await User.findOne({ Email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            FirstName,
            LastName,
            Gender,
            Email,
            Password,
            Role,
            Address,
            MobileNumber
        });

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(Password, salt);

        await user.save();

        // Send welcome email
        let mailOptions = {
            from: 'mathankpr48@gmail.com',
            to: Email,
            subject: 'Welcome to Our Platform',
            text: `Hello ${FirstName}, welcome to our platform!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    // Validate input, if needed
    const { error } = UserRegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    // Validate user input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { Email, Password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//Changepassword 

 const changePassword = async (req, res) => {
    //console.log('Change password request received:', req.body); // Debug log
    const { error } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { Email, CurrentPassword, NewPassword } = req.body;

    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or current password' });
        }

        const isMatch = await bcrypt.compare(CurrentPassword, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(NewPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// const logoutUser = async (req, res) => {
//     const {  notes } = req.body;

//     // Save the task to the database
//     if (notes) {
//         const feedback = new Feedback({ notes });
//         await feedback.save();
//         console.log('User feedback on logout:', notes);
//     }

//     // Destroy the session or token here
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ message: 'Could not log out' });
//         }
//         res.status(200).json({ message: 'Logout successful' });
//     });
// };


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    changePassword,
   // logoutUser
};

