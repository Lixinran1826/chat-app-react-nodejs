import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { teacherCoursesRoute, addCourseRoute } from '../utils/APIRoutes'; // 引入新的 API 路由
import { assignmentsRoute } from '../utils/APIRoutes';
import Logout from '../components/Logout';
import BackgroundImage from '../assets/bg_mln.jpg';
import AddCourseForm from '../components/AddCourseForm'; // 新增课程表单组件
import MyLecturesSection from '../components/MyLecturesSection'; // 教师端的授课模块
import AssignmentSection from '../components/AssignmentSection';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// 模拟用户头像（黑白插图）
const userAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAzNUgyNUE5IDkgMCAwIDAgMzQgMjZIMTZDMTYgMzEgMTUgMzUgMTUgMzVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==';


export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUserId, setCurrentUserId] = useState(undefined); // 新增：存储用户ID
  const [courses, setCourses] = useState([]); // 存储教师课程列表
  const [showAddCourseForm, setShowAddCourseForm] = useState(false); // 控制新增课程表单显示

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // 获取当前用户信息和教师课程
  useEffect(() => {
    (async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (!data) {
        navigate('/Login');
        return;
      }
      // 检查角色，非教师则跳转回普通 Dashboard 或登录页
      if (data.role !== 'teacher') {
        navigate('/Dshboard');
        return;
      }

      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
      setCurrentUserId(data._id); // 保存用户ID

      // 获取教师的课程列表
      try {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY); // 假设 token 存储在此
        const response = await axios.get(teacherCoursesRoute, {
          headers: {
            Authorization: `Bearer ${token}` // 发送 JWT Token
          }
        });
        if (response.data.status) {
          setCourses(response.data.courses);
        } else {
          toast.error("Failed to load courses: " + response.data.msg, toastOptions);
        }
      } catch (error) {
        console.error("Error fetching teacher courses:", error);
        toast.error("Failed to load courses. Please try again later.", toastOptions);
      }
    })();
  }, [navigate]);

  // 处理新增课程提交
  const handleAddCourseSubmit = async (courseData) => {
    try {
      const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY); // 假设 token 存储在此
      const response = await axios.post(addCourseRoute, courseData, {
        headers: {
          Authorization: `Bearer ${token}` // 发送 JWT Token
        }
      });
      if (response.data.status) {
        toast.success("Course added successfully!", toastOptions);
        setShowAddCourseForm(false); // 关闭表单
        // 重新获取课程列表以更新显示
        const newCoursesResponse = await axios.get(teacherCoursesRoute, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (newCoursesResponse.data.status) {
          setCourses(newCoursesResponse.data.courses);
        }
      } else {
        toast.error("Failed to add course: " + response.data.msg, toastOptions);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course. Please try again.", toastOptions);
    }
  };

  return (
    <OuterContainer>
      <Container>
        {/* 顶部区域 */}
        <div className="header">
          <button className="back-button" onClick={() => navigate('/teamspace')}>
            ← {/* 箭头方向改为向左，更符合返回的语义 */}
          </button>
          <div className="title">
            <h1>教师工作台 | Teacher Dashboard</h1>
            <h2>Powerful Toolkit for Teachers</h2>
          </div>
          <div className="user-greeting">
            <Link to="/teacher-dashboard">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage || userAvatar}`}
                alt="avatar"
              />
            </Link>
            <span>Hi, {currentUserName || 'Teacher Name'}</span>
            <Logout />
          </div>
        </div>

        {/* 团队选择区域 - 教师端可能不需要，或者需要修改为教师团队 */}
        <div className="search-team">
          <div className="team-buttons">
            <button className="team hpc-team">
              <span role="img" aria-label="person">
                👤
              </span>{' '}
              高级软件工程课程群
            </button>
            <button className="team sodev-team">
              <span role="img" aria-label="person">
                👤
              </span>{' '}
              现代软件开发方法课程群
            </button>
            <button className="team hpc-team">
              <span role="img" aria-label="person">
                🎯
              </span>{' '}
              高级软件工程助教群
            </button>
            <button className="team sodev-team">
              <span role="img" aria-label="person">
                👩🏻‍💻
              </span>{' '}
              现代软件开发方法助教群
            </button>
            {/* 其他按钮可以根据教师团队需求调整 */}
          </div>
        </div>

        {/* “我的授课”功能模块 */}
        <MyLecturesSection
          courses={courses}
          onAddCourseClick={() => setShowAddCourseForm(true)}
          onCourseCardClick={(courseId) => navigate(`/course-management/${courseId}`)} // 点击课程卡片进入管理界面
        />

        {/* 新增课程表单 */}
        {showAddCourseForm && (
          <AddCourseForm
            onSubmit={handleAddCourseSubmit}
            onCancel={() => setShowAddCourseForm(false)}
          />
        )}

        {/* 待办任务区域，教师端也可能有任务，例如批改作业 */}
        {/* 这里复用 AssignmentSection，但其内部数据需要从后端获取教师相关的任务 */}
       <div className="assignment-section-container">
            <AssignmentSection />
        </div>

      </Container>
      <ToastContainer />
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 5rem;

  min-height: 100vh;
  width: 100vw;
  position: relative;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow-y: auto; //  确保内容可以滚动

  margin: 0 auto;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px; /* 调整最大宽度以适应更多内容 */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color:rgba(255, 253, 255, 0.91);
  gap: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 确保元素之间有间隔 */
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
      flex: 1; /* 让标题区域占据更多空间 */
      align-items: center;
      h1 {
        font-size: 1.8rem;
        color: #333;
        margin: 0;
        text-align: center;
      }
      h2 {
        font-size: 1.2rem;
        color: #666;
        margin: 0.2rem 0 0;
        text-align: center;
      }
    }
  }

  .search-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    .team-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap; /* 允许按钮换行 */
      justify-content: center; /* 居中按钮 */
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

  .assignment-section-container {
      display: flex;
      justify-content: flex-start;
  }

  .assignment-section-container > * {
          justify-content: flex-start;
    }

  /* 响应式调整 */
  @media (max-width: 768px) {
    padding: 1rem;
    .header {
      flex-direction: column;
      align-items: center;
      .back-button {
        position: relative; /* 调整位置 */
        top: unset;
        left: unset;
        margin-bottom: 1rem;
      }
    }
    .title {
      h1 {
        font-size: 1.5rem;
      }
      h2 {
        font-size: 1rem;
      }
    }
    .user-greeting {
      margin-top: 1rem;
      width: 100%;
      justify-content: center;
    }
    .search-team .team-buttons {
      flex-direction: column;
      width: 100%;
      .team {
        width: 100%;
        justify-content: center;
      }
    }
  }
`;