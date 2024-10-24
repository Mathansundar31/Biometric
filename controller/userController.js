// controllers/userController.js

const User = require('../models/Users');
const Attendance = require('../models/Attendance');
const Joi = require('joi');

// Validation Schemas
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    fingerprint: Joi.string().min(5).max(5000).required(),
  });
  
  const attendanceSchema = Joi.object({
    employeeId: Joi.string().required(),
    fingerprint: Joi.string().min(5).max(5000).required(),
    type: Joi.string().required(),
  });

const { v4: uuidv4 } = require('uuid'); // Import UUID for generating unique IDs

// Register User
exports.registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, fingerprint } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Generate a unique employee ID
    const employeeId = `PCS-${uuidv4().slice(0, 8)}`; // Example format: PCS-1234abcd

    const user = new User({ username, fingerprint, employeeId });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', employeeId });
  } catch (err) {
    console.error("Failed to register user:", err);
    res.status(500).json({ message: 'Failed to register the user' });
  }
};


  // Record Attendance (In/Out)
exports.recordAttendance = async (req, res) => {

    const { error } = attendanceSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { employeeId, fingerprint, type } = req.body; // Expect type to indicate "in" or "out"
    
    if (!type || (type !== 'in' && type !== 'out')) {
      return res.status(400).json({ message: 'Invalid attendance type' });
    }
  
    try {
      if (type === 'in') {
        // Record in time
        const attendance = new Attendance({ employeeId, fingerprint });
        await attendance.save();
        return res.status(201).json({ message: 'Attendance marked as in', attendance });
      } else {
        // Record out time
        const attendanceRecord = await Attendance.findOne({ employeeId, outTime: { $exists: false } });
        if (!attendanceRecord) {
          return res.status(400).json({ message: 'No in record found for this employee' });
        }
  
        attendanceRecord.outTime = Date.now(); // Set the out time
        await attendanceRecord.save();
        return res.status(200).json({ message: 'Attendance marked as out', attendanceRecord });
      }
    } catch (err) {
      console.error('Error recording attendance:', err);
      res.status(500).json({ message: 'Failed to record attendance' });
    }
  };
  