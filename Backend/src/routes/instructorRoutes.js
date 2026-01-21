const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyLectures } = require('../controllers/instructorController');

router.use(protect);

router.get('/lectures', getMyLectures);

module.exports = router;
