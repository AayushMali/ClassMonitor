const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllInstructors,
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLecture,
  getLecturesForCourse,
  deleteLecture
} = require('../controllers/adminController');

router.use(protect);
router.use(adminOnly);

router.get('/instructors', getAllInstructors);
router.route('/courses').get(getAllCourses).post(createCourse);
router.route('/courses/:id').get(getCourseById).put(updateCourse).delete(deleteCourse);
router.route('/courses/:id/lectures').get(getLecturesForCourse).post(addLecture);
router.delete('/lectures/:id', deleteLecture);

module.exports = router;
