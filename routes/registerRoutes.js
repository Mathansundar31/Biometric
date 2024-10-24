const express = require('express');
 
const registercontroller = require('../controller/registerController');
const {changePassword} = require('../controller/registerController');
//const authendicate = require('../middleware/authendicate');
const router = express.Router();

// Route to create a new employee
router.post('/register', registercontroller.createUser);

// Route to get all employees
router.get('/', registercontroller.getAllUsers);

// Route to get a single employee by ID
router.get('/:id', registercontroller.getUserById);

// Route to update an employee by ID
router.put('/:id', registercontroller.updateUser);

// Route to delete an employee by ID
router.delete('/:id', registercontroller.deleteUser);

// Route to log in an employee
router.post('/login', registercontroller.loginUser);

// New route for changing password
// router.post('/changepassword', changePassword);

router.post('/change-password', (req, res, next) => {
    console.log('Change password request received:', req.body);
    next();
}, changePassword);

//Logout user

//router.post('/logout', registercontroller.logoutUser);

module.exports = router;
