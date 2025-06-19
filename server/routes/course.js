const { 
    getCourses, 
    getAssignments,
    addCourse,
    getTeacherCourses,
    getStudentCourses,
    getCourseDetails,
    enrollCourse,
    unenrollCourse,
} = require("../controllers/courseController");

const router = require("express").Router();

const verifyToken = require("../middlewares/authMiddleware"); // 引入认证中间件

// 辅助中间件：验证用户是否为教师
const verifyTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ msg: "Access Denied: Only teachers can perform this action." });
  }
};

// 辅助中间件：验证用户是否为学生 (如果需要严格限制，否则 verifyToken 足够)
const verifyStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ msg: "Access Denied: Only students can perform this action." });
    }
};

router.get("/courses/:userId", getCourses);
router.get("/assignments/:courseId", getAssignments);
// 获取所有课程列表 (不需要登录)
router.get("/courses", getCourses);
// 学生获取课程详情
router.get("/getstudentcourses", verifyToken, verifyStudent, getStudentCourses);
// 教师添加课程
router.post("/addcourse", verifyToken, verifyTeacher, addCourse);
// 获取当前教师的所有课程
router.get("/getteachercourses", verifyToken, verifyTeacher, getTeacherCourses);
// 获取单个课程的详细信息
router.get("/getcoursedetails/:courseId", verifyToken, getCourseDetails);
// 学生选课 (需要登录且是学生)
router.post("/enrollcourse", verifyToken, verifyStudent, enrollCourse);
// 学生退课 (需要登录且是学生)
router.post("/unenrollcourse", verifyToken, verifyStudent, unenrollCourse);


module.exports = router;