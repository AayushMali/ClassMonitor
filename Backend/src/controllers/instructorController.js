const Lecture = require('../models/Lecture');

// @desc    Get logged in instructor's lectures
// @route   GET /api/instructor/lectures
const getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructor: req.user._id })
      .populate('course', 'name level description')
      .sort({ date: 1 });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyLectures };
