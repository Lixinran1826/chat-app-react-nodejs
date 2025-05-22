import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { coursesRoute, assignmentsRoute } from "../utils/APIRoutes";

import Logout from "../components/Logout";
import BackgroundImage from '../assets/bg_mln.jpg'; // 新增背景图
// 模拟用户头像（黑白插图，可以替换为真实图片）
const userAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAzNUgyNUE5IDkgMCAwIDAgMzQgMjZIMTZDMTYgMzEgMTUgMzUgMTUgMzVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses] = useState([
    { id: "1", name: "现代软件开发方法", nameEn: "Modern Software Dev", hasUpdate: true, progress: 75 },
    { id: "2", name: "高性能计算编程", nameEn: "High-Performance Computing", hasUpdate: false, progress: 60 },
    { id: "3", name: "计算机图形学", nameEn: "Computer Graphics", hasUpdate: false, progress: 45 },
    { id: "4", name: "计算机动画", nameEn: "Computer Animation", hasUpdate: false, progress: 80 },
    { id: "5", name: "GPU架构与编程", nameEn: "GPU", hasUpdate: false, progress: 10 },
    { id: "6", name: "工程伦理", nameEn: "ProjectTheory", hasUpdate: false, progress: 90 },
    { id: "7", name: "英语A", nameEn: "English A", hasUpdate: false, progress: 20 },
  ]);
  const [assignments] = useState([
    { id: "1", course: "HPC", task: "Homework 1" },
    { id: "2", course: "Software Dev", task: "Homework 1" },
    { id: "3", course: "Animation", task: "Presentation" },
    { id: "4", course: "CG", task: "Homework 2" },
    { id: "5", course: "GPU", task: "GPU Competiton" },
    { id: "6", course: "ProjectTheory", task: "Reading" },
    { id: "7", course: "EnglishA", task: "Exam" },
  ]);

  // 获取当前用户信息
  useEffect(() => {
    (async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      if (!data) {
        navigate("/login");
        return;
      }
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    })();
  }, [navigate]);

  // 搜索课程（模拟功能）
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <OuterContainer>
    <Container>
      {/* 顶部区域 */}
      <div className="header">
          
          <button className="back-button" onClick={() => navigate("/teamspace")}>
            →
          </button>
          <div className="title">
            <h1>个人工作台  |  Home </h1>
          
            <h2>iCampus: 让每个人都能说 “ I can pass ! ”</h2>
          </div>
          
          <div className="user-greeting">
          <Link to="/">
              <img
              src={`data:image/svg+xml;base64,${currentUserImage}`}
              alt="avatar"
              />
          </Link>
          <span>Hi, {currentUserName || "MadsMikkelsen"}</span>
          
          <Logout />
          </div>
          
      </div>


      {/* 搜索和团队选择区域 */}
      <div className="search-team">
        <input
          type="text"
          placeholder="请输入您感兴趣的课程名称 / Enter the course name you are interested in"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="team-buttons">
          <button className="team hpc-team">
            <span role="img" aria-label="person">👤</span> HPC-Team
          </button>
          <button className="team sodev-team">
            <span role="img" aria-label="person">👤</span> SoDev-Team
          </button>
          <button className="team anin-team">
            <span role="img" aria-label="person">👤</span> Anin-Team
          </button>
          <button className="team weteam">
            <span role="img" aria-label="person">👤</span> weTeam
          </button>
        </div>
      </div>

      {/* 课程列表区域 */}
      <div className="course-section">
        <div className="course-header">
          <h2>课程列表 / Course List</h2>
          <span className="notes-tab">我的笔记 / My Notes</span>
        </div>
        <div className="course-list">
          {filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              {course.hasUpdate && <span className="update-dot" />}
              <h3>{course.name} / {course.nameEn}</h3>
              <div className="progress-bar">
                <div style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 待办任务区域 */}
      <div className="assignments-section">
        <h2>待办任务 / Upcoming Assignments</h2>
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-item">
              <span className="pin-icon">📌</span>
              <span>{assignment.course} - {assignment.task}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
    </OuterContainer>
  );
}



// 新增 OuterContainer 样式，包裹整个页面
const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5rem;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  // background-color:rgba(222, 210, 224, 0.34);
  background-image: url(${BackgroundImage}); /* 设置背景图 */
  background-size: cover; /* 铺满容器 */
  background-position: center; /* 居中 */
  box-sizing: border-box;

  /* 限制最大宽度，防止页面过度拉伸 */
  margin: 0 auto; /* 水平居中 */
`;




// 修改 Container 样式，确保其适应 OuterContainer
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
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
    .notification {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      .notification-dot {
        width: 0.8rem;
        height: 0.8rem;
        background-color: #ff6b6b;
        border-radius: 50%;
      }
    }
  }

  /* 搜索和团队选择区域 */
  .search-team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    input {
      width: 100%;
      max-width: 600px;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      color: #333;
      &::placeholder {
        color: #999;
      }
    }
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
        background-color: #ff6b6b; /* 红色 */
      }
      .sodev-team {
        background-color: #4ecdc4; /* 青色 */
      }
      .anin-team {
        background-color: #45b7d1; /* 蓝色 */
      }
      .weteam {
        background-color: #96c93d; /* 绿色 */
      }
    }
  }

  /* 课程列表区域 */
  .course-section {
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      h2 {
        font-size: 1.5rem;
        color: #333;
      }
      .notes-tab {
        font-size: 1rem;
        color: #666;
        cursor: pointer;
        &:hover {
          color: #007bff;
        }
      }
    }
    .course-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      .course-card {
        position: relative;
        background-color: #f9f9f9;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: 0.3s ease-in-out;
        cursor: pointer;
        aspect-ratio: 3 / 2; /* Added to enforce square shape */
        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .update-dot {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 0.8rem;
          height: 0.8rem;
          background-color: #ff6b6b;
          border-radius: 50%;
        }
        h3 {
          font-size: 1.1rem;
          color: #333;
          margin: 0 0 0.5rem;
        }
        .progress-bar {
          position: absolute;
          bottom: 0.5rem; /* 与course-list底部的距离 */;
          left: 1rem; /* 与course-list的padding对齐 */
          right: 1rem; /* 确保进度条宽度占满 */
          height: 0.4rem;
          width: calc(100% - 2rem); /* 考虑左右padding */
          background-color: #ddd;
          border-radius: 0.2rem;
          overflow: hidden;
          
          div {
            height: 100%;
            background-color: #007bff;
            transition: width 0.3s ease-in-out;
          }
        }
      }
    }
  }

  /* 待办任务区域 */
  .assignments-section {
    h2 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 1rem;
    }
    .assignment-list {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      .assignment-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: #f9f9f9;
        border-radius: 0.5rem;
        padding: 0.8rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        .pin-icon {
          color: #96c93d; /* 绿色图钉 */
          font-size: 1.2rem;
        }
        span {
          font-size: 1rem;
          color: #333;
        }
      }
    }
  }
`;