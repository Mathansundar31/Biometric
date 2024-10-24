const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  fingerprint: { type: String, required: true },
  inTime: { type: Date, default: Date.now }, // Default to current time when "in" is recorded
  outTime: { type: Date }, // To be set when "out" is recorded
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
