import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from '../assets/bg_mln.jpg'; 
import Logout from "../components/Logout";
// 模拟用户头像（开朗的青蛙，戴眼罩卡通人物）
const frogAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM5NmM5M2QiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAyN0gyNUE5IDkgMCAwIDAgMzQgMjZIMTZaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0yMCAyM0gzMCIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4=";
// 模拟其他队员头像（示例）
const memberAvatar2 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM0ZWNkYzQiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAyN0gyNUE5IDkgMCAwIDAgMzQgMjZIMTZaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==";
const memberAvatar3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM0NWI3ZDEiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAyN0gyNUE5IDkgMCAwIDAgMzQgMjZIMTZaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==";

export default function TeamSpace() {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 模拟队员数据
  const members = [
    {
      id: "1",
      avatar: frogAvatar,
      name: "开朗的青蛙 / Cheerful Frog",
      intro: "我做PPT很快。 / I make PPTs quickly.",
    },
    {
      id: "2",
      avatar: memberAvatar2,
      name: "冷静的海豚 / Calm Dolphin",
      intro: "擅长代码调试。 / Good at debugging code.",
    },
    {
      id: "3",
      avatar: memberAvatar3,
      name: "机智的狐狸 / Clever Fox",
      intro: "设计能力很强。 / Strong design skills.",
    },
    {
      id: "4",
      avatar: memberAvatar3,
      name: "老实的北极熊 / Clever Fox",
      intro: "服从安排。 / Obey the arrangement.",
    },
  ];


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

  // 邀请按钮点击事件（模拟）
  const handleInvite = (memberName) => {
    alert(`已邀请 "${memberName}" 加入队伍！`);
  };

  // 鼠标按下事件
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  // 鼠标移动事件
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1; // 调整滑动速度
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // 鼠标松开事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 鼠标离开事件
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    
    <OuterContainer>

    <Container>
      {/* 顶部区域 */}
      <div className="header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <button className="back-button" onClick={() => navigate("/teamassignment")}>
          →
        </button>
        <div className="title">
          <h1>小组空间 / Team Space</h1>
        
          <h2>现代软件开发方法 / Modern Software Development</h2>
        </div>
        
        <div className="user-greeting">
        <Link to="/Dashboard">
            <img
            src={`data:image/svg+xml;base64,${currentUserImage}`}
            alt="avatar"
            />
        </Link>
        <span>Hi, {currentUserName || "MadsMikkelsen"}</span>
        
        <Logout />
        </div>
      </div>

      {/* 导航标签路径 */}
      <div className="breadcrumb">
        <span className="active">创建队伍 / Create Team</span> &gt;
        <span >任务分工 / Task Assignment </span> &gt;
        <span>任务提交 / Task Submission</span> &gt;
        <span>评分反馈 / Feedback</span>
      </div>

      {/* 功能按钮区域 */}
      <div className="function-buttons">
        <button className="function-btn team-status">
          <span role="img" aria-label="chart">📊</span>
          团队情况 / Team Status
        </button>
        <button className="function-btn my-team">
          <span role="img" aria-label="people">👥</span>
          我的队伍 / My Team
        </button>
        <button className="function-btn match-result">
          <span role="img" aria-label="envelope">📄</span>
          匹配结果 / Match Result
        </button>
        <div className="function-btn placeholder">
          <span role="img" aria-label="folder">🗂️</span>
          <span className="swipe-hint">左右滑动 / Swipe Left or Right</span>
        </div>
      </div>

      {/* 队员卡片区域 */}
      <div className="member-card-container">
        <div
          className="member-card-slider"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <img src={member.avatar} alt="member avatar" />
              <h3>{member.name}</h3>
              <p>{member.intro}</p>
              <button
                className="invite-button"
                onClick={() => handleInvite(member.name.split(" / ")[0])}
              >
                邀请 / Invite
              </button>
            </div>
          ))}
        </div>
        <span className="swipe-hint">左右滑动 / Swipe Left or Right</span>
      </div>

      {/* 课程要求区域 */}
      <div className="requirements-section">
        <div className="requirements-header">
          <h2>课程要求 / Course Requirements</h2>
          <span className="all-tag">全部 / All</span>
        </div>
        <div className="requirements-content">
          <div className="requirement-item">项目目标 / Project Goals</div>
          <div className="requirement-item">项目意义 / Project Significance</div>
          <div className="requirement-item">项目内容 / Project Content</div>
          <div className="requirement-item">小组协作 / Team Collaboration</div>
          <div className="requirement-item">编程模式（MVC） / Programming Model (MVC)</div>
          <div className="requirement-item">开发方法（BDD、Lo-Fi UI、TDD） / Development Methods (BDD, Lo-Fi UI, TDD)</div>
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

  /* 导航标签路径 */
  .breadcrumb {
    font-size: 0.9rem;
    color: #666;
    span {
      margin: 0 0.5rem;
      cursor: pointer;
      &:hover {
        color: #007bff;
      }
    }
    .active {
      color: #007bff;
      font-weight: bold;
      &:hover {
        color: #0056b3;
      }
    }
  }

  /* 功能按钮区域 */
  .function-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    .function-btn {
      background-color: #f9f9f9;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: 0.3s ease-in-out;
      font-size: 1rem;
      color: #333;
      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        color: #007bff;
      }
      span[role="img"] {
        font-size: 1.5rem;
      }
    }
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: #f0f0f0;
      color: #999;
      cursor: default;
      &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: #999;
      }
      .swipe-hint {
        font-size: 0.8rem;
      }
    }
  }

  /* 队员卡片区域 */
  .member-card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    .member-card-slider {
      display: flex;
      overflow-x: auto;
      scroll-behavior: smooth;
      width: 100%;
      gap: 1rem;
      padding: 0.5rem 0;
      cursor: grab;
      user-select: none;
      &::-webkit-scrollbar {
        display: none; /* 隐藏滚动条 */
      }
      &:active {
        cursor: grabbing;
      }
      .member-card {
        flex: 0 0 auto;
        width: 250px; /* 固定宽度 */
        background-color: #f9f9f9;
        border-radius: 0.5rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        img {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
        }
        h3 {
          font-size: 1.2rem;
          color: #333;
          margin: 0;
        }
        p {
          font-size: 1rem;
          color: #666;
          margin: 0;
        }
        .invite-button {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: 0.3s ease-in-out;
          &:hover {
            background-color: #0056b3;
          }
        }
      }
    }
    .swipe-hint {
      font-size: 0.8rem;
      color: #999;
    }
  }

  /* 课程要求区域 */
  .requirements-section {
    .requirements-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      h2 {
        font-size: 1.5rem;
        color: #333;
        margin: 0;
      }
      .all-tag {
        background-color: #007bff;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
      }
    }
    .requirements-content {
      background-color: #f9f9f9;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      max-height: 200px;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &::-webkit-scrollbar {
        width: 0.4rem;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 0.2rem;
      }
      .requirement-item {
        background-color: #ffffff;
        border-radius: 0.5rem;
        padding: 0.8rem;
        font-size: 1rem;
        color: #333;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    }
  }
`;