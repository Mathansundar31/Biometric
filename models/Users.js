const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fingerprint: { type: String, required: true },
  employeeId: { type: String, unique: true } // Add employeeId field
});

const User = mongoose.model('User', userSchema);
module.exports = User;
