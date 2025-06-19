import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import BackgroundImage from '../assets/bg_mln.jpg';
import Logout from "../components/Logout"; 
// 模拟用户头像（可替换为真实图片）
const userAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAzNUgyNUE5IDkgMCAwIDAgMzQgMjZIMTZDMTYgMzEgMTUgMzUgMTUgMzVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==';

export default function AssignmentSubmitted() {
  const navigate = useNavigate();

  const handleRemind = () => {
    alert('已发送提醒，请耐心等待老师批阅！');
  };

  return (
    
    <OuterContainer>

      {/* 顶部区域 */}
    <PageContainer>
      <div className="header">
        <button className="back-button" onClick={() => navigate("/Dashboard")}>
                ←
            </button>
            <div className="title">
                <h1>等待批阅 / Waiting For Review</h1>
                <h2>现代软件开发方法 / Modern Software Development</h2>
            </div>
            
            <div className="notification">
                <Logout />
            </div>
            
      </div>
      {/* 中心提示框 */}
      <MainContent>
        <InfoBox>
          <div className="icon">🙋</div>
          <div className="line1">已完成作业提交阶段！</div>
          <div className="line2">请等待老师审核后的批阅。</div>
        </InfoBox>
        <RemindButton onClick={handleRemind}>🔔 提醒一下</RemindButton>
      </MainContent>

      {/* 底部导航栏 */}
      <FooterNav>
        <div className="avatar">👤</div>
        <div className="nav-text">团队管理 &gt; 任务详情 &gt; 退出</div>
      </FooterNav>
    </PageContainer>

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
  background-repeat: no-repeat; /* 不重复 */
  box-sizing: border-box;

  /* 限制最大宽度，防止页面过度拉伸 */
  margin: 0 auto; /* 水平居中 */
`;

const PageContainer = styled.div`
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
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  align-items: center;
  border-bottom: 1px solid #eee;
  .left {
    font-size: 1rem;
    font-weight: bold;
  }
  .right {
    position: relative;
    font-size: 1.2rem;
  }
  .red-dot {
    position: absolute;
    top: 0;
    right: -4px;
    width: 8px;
    height: 8px;
    background: red;
    border-radius: 50%;
  }
`;

const Breadcrumb = styled.div`
  font-size: 0.75rem;
  color: #888;
  padding: 0 1rem;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InfoBox = styled.div`
  border: 2px solid #ccc;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 300px;
  background-color:rgba(245, 244, 246, 0.81);
  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  .line1 {
    font-size: 1.1rem;
    font-weight: bold;
    color: #000;
  }
  .line2 {
    font-size: 0.9rem;
    color: #000;
    margin-top: 0.3rem;
  }
`;

const RemindButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  border: 2px solid #000;
  background: #fff;
  border-radius: 999px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-top: 1px solid #eee;
  font-size: 0.75rem;
  color: #888;
  align-items: center;
  .avatar {
    font-size: 1.5rem;
  }
`;
