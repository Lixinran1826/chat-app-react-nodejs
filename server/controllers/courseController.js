const Course = require("../models/courseModel");
const Assignment = require("../models/assignmentModel");

module.exports.getCourses = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const courses = await Course.find({ userId }).select([
      "name",
      "description",
      "_id",
      "createdAt",
    ]);
    return res.json(courses);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAssignments = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const assignments = await Assignment.find({ courseId }).select([
      "title",
      "description",
      "dueDate",
      "_id",
      "createdAt",
    ]);
    return res.json(assignments);
  } catch (ex) {
    next(ex);
  }
};