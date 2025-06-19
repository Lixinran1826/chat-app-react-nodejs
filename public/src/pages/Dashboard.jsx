import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  getCoursesRoute,
  assignmentsRoute,
  studentcoursesRoute,
  enrollCourseRoute,
  unenrollCourseRoute,
  courseDetailsRoute,
} from '../utils/APIRoutes';
import { toast, ToastContainer } from 'react-toastify'; 
import Logout from '../components/Logout';
import CourseSection from '../components/CourseSection';
import AssignmentSection from '../components/AssignmentSection';
import BackgroundImage from '../assets/bg_mln.jpg';


// 模拟用户头像（黑白插图）
const userAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAzNUgyNUE5IDkgMCAwIDAgMzQgMjZIMTZDMTYgMzEgMTUgMzUgMTUgMzVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUserId, setCurrentUserId] = useState(undefined); // 学生 ID
  const [enrolledCourses, setEnrolledCourses] = useState([]); // 学生已选课程
  const [allAvailableCourses, setAllAvailableCourses] = useState([]); // 所有可用课程

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // 模拟课程和任务数据（可替换为从后台获取）
  // const [courses] = useState([
  //   { id: '1', name: '现代软件开发方法', nameEn: 'Modern Software Dev', hasUpdate: true, progress: 75 },
  //   { id: '2', name: '高性能计算编程', nameEn: 'High-Performance Computing', hasUpdate: false, progress: 60 },
  //   { id: '3', name: '计算机图形学', nameEn: 'Computer Graphics', hasUpdate: false, progress: 45 },
  //   { id: '4', name: '计算机动画', nameEn: 'Computer Animation', hasUpdate: false, progress: 80 },
  //   { id: '5', name: 'GPU架构与编程', nameEn: 'GPU', hasUpdate: false, progress: 10 },
  //   { id: '6', name: '工程伦理', nameEn: 'ProjectTheory', hasUpdate: false, progress: 90 },
  //   { id: '7', name: '英语A', nameEn: 'English A', hasUpdate: false, progress: 20 },
  // ]);

  const [assignments] = useState([
    { id: '1', course: 'HPC', task: 'Homework 1' },
    { id: '2', course: 'Software Dev', task: 'Homework 1' },
    { id: '3', course: 'Animation', task: 'Presentation' },
    { id: '4', course: 'CG', task: 'Homework 2' },
    { id: '5', course: 'GPU', task: 'GPU Competiton' },
    { id: '6', course: 'ProjectTheory', task: 'Reading' },
    { id: '7', course: 'EnglishA', task: 'Exam' },
  ]);

  // 获取当前用户信息
  useEffect(() => {
    (async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (!data) {
        navigate('/login');
        return;
      }
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
      setCurrentUserId(data._id); // 保存学生用户 ID
      // 验证用户是否已登录
      const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
      if (!token) {
          toast.error("Authentication token missing. Please log in again.", toastOptions);
          navigate('/login');
          return;
      }
      try {
        // 1. 获取所有可用课程
        const allCoursesRes = await axios.get(getCoursesRoute, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (allCoursesRes.data.status) {
          setAllAvailableCourses(allCoursesRes.data.courses);
        } else {
          toast.error("Failed to load all courses: " + allCoursesRes.data.msg, toastOptions);
        }

        // 2. 获取学生已选课程
        const studentCoursesRes = await axios.get(studentcoursesRoute, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (studentCoursesRes.data.status) {
          setEnrolledCourses(studentCoursesRes.data.courses);
        } else {
          toast.error("Failed to load your enrolled courses: " + studentCoursesRes.data.msg, toastOptions);
        }

      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again later.", toastOptions);
      }
    })();
  }, [navigate]);

  // 处理学生选课/退课逻辑，并更新状态和数据库
  const handleToggleEnrollment = async (courseId, isEnrolling) => {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
    if (!token || !currentUserId) {
        toast.error("User not authenticated. Please log in.", toastOptions);
        navigate('/login');
        return;
    }

    try {
      let response;
      if (isEnrolling) { // 选课
        response = await axios.post(enrollCourseRoute, { courseId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else { // 退课
        response = await axios.post(unenrollCourseRoute, { courseId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.status) {
        toast.success(response.data.msg, toastOptions);
        // 成功后，重新获取学生已选课程列表，以更新 UI
        const studentCoursesRes = await axios.get(studentcoursesRoute, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (studentCoursesRes.data.status) {
          setEnrolledCourses(studentCoursesRes.data.courses);
        }
      } else {
        toast.error(response.data.msg, toastOptions);
      }
    } catch (error) {
      console.error("Error toggling enrollment:", error);
      toast.error("Failed to update course enrollment. Please try again.", toastOptions);
    }
  };

  return (
    <OuterContainer>
      <Container>
        {/* 顶部区域 */}
        <div className="header">
          <button className="back-button" onClick={() => navigate('/teamspace')}>
            →
          </button>
          <div className="title">
            <h1>个人工作台 | Home</h1>
            <h2>iCampus: 让每个人都能说 “ I can pass ! ”</h2>
          </div>
          <div className="user-greeting">
            <Link to="/Dashboard">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage || userAvatar}`}
                alt="avatar"
              />
            </Link>
            <span>Hi, {currentUserName || 'MadsMikkelsen'}</span>
            <Logout />
          </div>
        </div>

        {/* 团队选择区域 */}
        <div className="search-team">
          <div className="team-buttons">
            <button className="team hpc-team">
              <span role="img" aria-label="person">
                👤
              </span>{' '}
              HPC-Team
            </button>
            <button className="team sodev-team">
              <span role="img" aria-label="person">
                👤
              </span>{' '}
              SoDev-Team
            </button>
            <button className="team anin-team">
              <span role="img" aria-label="person">
                👤
              </span>{' '}
              Anin-Team
            </button>
            <button className="team weteam">
              <span role="img" aria-label="person">
                👤
              </span>{' '}
              weTeam
            </button>
          </div>
        </div>
        
        <div className="course-section-container">
            {/* 课程列表区域，使用 CourseSection 组件 */}
            {/* <CourseSection courses={courses} /> */}
            {/* 将 allAvailableCourses 和 enrolledCourses 传递给 CourseSection */}
            {/* 同时传递 handleToggleEnrollment 回调函数 */}
            <CourseSection
                allCourses={allAvailableCourses}
                enrolledCourses={enrolledCourses}
                onToggleEnrollment={handleToggleEnrollment}
            />
        </div>

       <div className="assignment-section-container">
            {/* 待办任务区域，使用 AssignmentsSection 组件 */}
            <AssignmentSection />
        </div>

      </Container>
      <ToastContainer /> 
      {/* 确保 ToastContainer 在页面底部 */}
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 5rem;

  /* 确保背景图覆盖整个视口 */
  min-height: 100vh; /* 至少占满视口高度 */
  width: 100vw; /* 占满视口宽度 */
  position: relative; /* 为背景图提供定位上下文 */
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* 水平居中内容 */
  margin: 0 auto;
  box-sizing: border-box;
`;


// 修改 Container 样式，确保其适应 OuterContainer
const Container = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color:rgba(255, 253, 255, 0.91);
  gap: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 可选：添加阴影以提升视觉效果 */
  border-radius: 1rem; /* 可选：添加圆角 */
  box-sizing: border-box;

    
  /* 顶部区域 */
  .header {
    display: flex;
    align-items: center;
    position: relative;
    .back-button {
      background-color: #f0f0f0;
      border: none;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      color: #333;
      &:hover {
        background-color: #e0e0e0;
      }
    }
    .user-greeting {
      display: flex;
      align-items: center;
      gap: 1rem;
      img {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 50%;
      }
      span {
        font-size: 1rem;
        color: #666;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      h1 {
        font-size: 1.8rem;
        color: #333;
        margin: 0;
      }
      h2 {
        font-size: 1.2rem;
        color: #666;
        margin: 0.2rem 0 0;
      }
    }
  }

  /* 团队选择区域 */
  .search-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    .team-buttons {
      display: flex;
      gap: 1rem;
      .team {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        color: white;
        font-size: 0.9rem;
        transition: 0.3s ease-in-out;
        &:hover {
          opacity: 0.8;
        }
      }
      .hpc-team {
        background-color: #ff6b6b;
      }
      .sodev-team {
        background-color: #4ecdc4;
      }
      .anin-team {
        background-color: #45b7d1;
      }
      .weteam {
        background-color: #96c93d;
      }
    }
  }

  
    /* 课程区域 */
    .course-section-container {
      display: flex;
  }

    .course-section-container > * {
          width: 100%; /* 示例宽度，与你的搜索栏一致 */
    }

        /* 课程区域 */
    .assignment-section-container {
      display: flex;
  }

    .assignment-section-container > * {
    }
      
`;