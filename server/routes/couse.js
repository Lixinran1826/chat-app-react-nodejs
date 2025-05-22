const { getCourses, getAssignments } = require("../controllers/courseController");

const router = require("express").Router();

router.get("/courses/:userId", getCourses);
router.get("/assignments/:courseId", getAssignments);

module.exports = router;