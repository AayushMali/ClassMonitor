const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

// @desc    Get all instructors
// @route   GET /api/admin/instructors
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-passwordHash');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/admin/courses
const createCourse = async (req, res) => {
  const { name, level, description, image } = req.body;
  try {
    const course = await Course.create({ name, level, description, image });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/admin/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/admin/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add lecture to course
// @route   POST /api/admin/courses/:id/lectures
const addLecture = async (req, res) => {
  const { instructorId, date } = req.body;
  const courseId = req.params.id;

  try {
    // Check for scheduling conflicts using UTC dates
    const [year, month, day] = date.split('-').map(Number);
    const lectureDateUTC = new Date(Date.UTC(year, month - 1, day));
    
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const existingLecture = await Lecture.findOne({
      instructor: instructorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingLecture) {
      return res.status(400).json({ message: 'Instructor is already assigned to another lecture on this date' });
    }

    const lecture = await Lecture.create({
      course: courseId,
      instructor: instructorId,
      date: lectureDateUTC
    });

    const course = await Course.findById(courseId);
    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json(lecture);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get lectures for a course
// @route   GET /api/admin/courses/:id/lectures
const getLecturesForCourse = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.id })
      .populate('instructor', 'name email')
      .populate('course', 'name');
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lecture
// @route   DELETE /api/admin/lectures/:id
const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (lecture) {
      // Also remove reference from Course
      await Course.findByIdAndUpdate(lecture.course, {
        $pull: { lectures: lecture._id }
      });
      await lecture.deleteOne();
      res.json({ message: 'Lecture removed' });
    } else {
      res.status(404).json({ message: 'Lecture not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
const updateCourse = async (req, res) => {
  const { name, level, description, image } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      course.name = name || course.name;
      course.level = level || course.level;
      course.description = description || course.description;
      course.image = image || course.image;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInstructors,
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLecture,
  getLecturesForCourse,
  deleteLecture
};
