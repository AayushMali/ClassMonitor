const mongoose = require('mongoose');

const lectureSchema = mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);
