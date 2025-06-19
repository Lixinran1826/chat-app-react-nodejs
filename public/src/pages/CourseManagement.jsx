// pages/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logout from '../components/Logout'; // 可以复用
import BackgroundImage from '../assets/bg_mln.jpg'; // 和 Dashboard 相同的背景图

// 模拟用户头像
const userAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MC41MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUuNSIgY3k9IjI1LjUiIHI9IjI1LjUiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTI1LjUgMTUuNUExNiA2IDAgMSAwIDI1LjUgMjUuNUExNiA2IDAgMSAwIDI1LjUgMTUuNVoiIGZpbGw9IiNmZmYiLz4KPHBhdGggZD0iTTE1LjUgMzUuNUgyNS41QTkgOSAwIDAgMCAzNC41IDI2LjVIMTYuNUMxNi41IDMxLjUgMTUuNSAzNS41IDE1LjUgMzUuNVoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+';


export default function CourseManagement() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // 从 URL 获取课程 ID
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect(() => {
    (async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (!data) {
        navigate('/login');
        return;
      }
      // 确保是教师才能访问此页面
      if (data.role !== 'teacher') {
        navigate('/dashboard'); // 非教师跳转回学生Dashboard
        return;
      }
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);

      // TODO: 获取课程详情的 API (后端未实现，暂时模拟数据)
      // fetchCourseDetails(courseId); // 实际调用后端 API
      
      // 模拟数据
      setTimeout(() => {
        setCourseDetails({
          _id: courseId,
          name: '模拟课程名称',
          description: '这是模拟课程的详细描述，用于展示管理界面。',
          location: '教学楼A 301室',
          schedule: [{ dayOfWeek: 1, startTime: '10:00', endTime: '12:00' }],
          teacher: { username: '模拟教师' },
          students: [ // 模拟学生列表
            { _id: 's1', username: '学生A' },
            { _id: 's2', username: '学生B' },
          ],
          // groups: [], // 模拟课程小组
          // assignments: [], // 模拟作业列表
        });
        setLoading(false);
      }, 1000);

    })();
  }, [courseId, navigate]);

  if (loading) {
    return <OuterContainer><p>加载课程信息...</p></OuterContainer>;
  }

  if (error) {
    return <OuterContainer><p>加载课程失败: {error}</p></OuterContainer>;
  }

  if (!courseDetails) {
    return <OuterContainer><p>未找到课程信息。</p></OuterContainer>;
  }

  return (
    <OuterContainer>
      <Container>
        {/* 顶部区域 */}
        <div className="header">
          <button className="back-button" onClick={() => navigate('/teacher-dashboard')}>
            ← {/* 返回教师 Dashboard */}
          </button>
          <div className="title">
            <h1>课程管理 / {courseDetails.name}</h1>
            <h2>管理你的课程</h2>
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

        <div className="course-overview">
          <h3>课程概览</h3>
          <p><strong>描述:</strong> {courseDetails.description}</p>
          <p><strong>地点:</strong> {courseDetails.location}</p>
          <p>
            <strong>时间:</strong>{' '}
            {courseDetails.schedule && courseDetails.schedule.length > 0 ? (
              courseDetails.schedule.map((s, index) => (
                <span key={index}>
                  {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][s.dayOfWeek % 7]} {s.startTime}-{s.endTime}
                  {index < courseDetails.schedule.length - 1 && '; '}
                </span>
              ))
            ) : (
              <span>暂无课程安排</span>
            )}
          </p>
        </div>

        {/* 课程管理功能模块占位 */}
        <div className="management-sections">
          <div className="section-card">
            <h3>选课学生列表 / Enrolled Students</h3>
            <ul>
              {courseDetails.students && courseDetails.students.length > 0 ? (
                courseDetails.students.map(student => (
                  <li key={student._id}>{student.username}</li>
                ))
              ) : (
                <li>暂无学生选课</li>
              )}
            </ul>
            {/* TODO: 添加管理学生的按钮 */}
          </div>

          <div className="section-card">
            <h3>课程小组列表 / Course Groups</h3>
            <p>（待完善课程小组 Model 后再实现）</p>
            {/* TODO: 添加管理小组的按钮 */}
          </div>

          <div className="section-card">
            <h3>作业列表 / Assignments</h3>
            <p>（待完善作业 Model 后再实现）</p>
            {/* TODO: 添加管理作业的按钮 */}
          </div>
        </div>
      </Container>
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
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
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
    justify-content: space-between;
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

  .course-overview {
    background-color: #f8f9fa;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);

    h3 {
      color: #007bff;
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.6rem;
    }
    p {
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 1.05rem;
    }
    strong {
      color: #000;
    }
  }

  .management-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .section-card {
    background-color: #fff;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    border: 1px solid #e9ecef;

    h3 {
      color: #28a745;
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.4rem;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
      color: #555;
    }
    p {
      color: #888;
      font-style: italic;
      text-align: center;
      padding: 1rem 0;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    .header {
      flex-direction: column;
      align-items: center;
      .back-button {
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
  }
`;