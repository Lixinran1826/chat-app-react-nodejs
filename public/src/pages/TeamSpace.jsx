import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from '../assets/bg_mln.jpg'; 
import Logout from "../components/Logout";
import useRandomAvatars from '../hooks/useRandomAvatars'; //生成随机头像的自定义 Hook

export default function TeamSpace() {
  // 招募板弹窗状态
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
  const openRecruitmentModal = () => {
    setIsRecruitmentModalOpen(true);
  };
  const closeRecruitmentModal = () => {
    setIsRecruitmentModalOpen(false);
  };
  // 使用自定义 Hook 生成随机头像
  const {avatars} = useRandomAvatars(5); // 生成 5 个头像
  const [randomAvatar1, setRandomAvatar1] = useState('');
  const [randomAvatar2, setRandomAvatar2] = useState('');
  const [randomAvatar3, setRandomAvatar3] = useState('');
  const [randomAvatar4, setRandomAvatar4] = useState('');
  const [randomAvatar5, setRandomAvatar5] = useState('');

  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (avatars.length === 5) {
      setRandomAvatar1(avatars[0]);
      setRandomAvatar2(avatars[1]);
      setRandomAvatar3(avatars[2]);
      setRandomAvatar4(avatars[3]);
      setRandomAvatar5(avatars[4]);
    }
  }, [avatars]);


  // 模拟队员数据
  const members = [
    {
      id: "1",
      avatar: `data:image/svg+xml;base64,${randomAvatar1}`,
      name: "开朗的青蛙",
      intro: "我做PPT很快",
    },
    {
      id: "2",
      avatar: `data:image/svg+xml;base64,${randomAvatar2}`,
      name: "冷静的海豚",
      intro: "擅长代码调试",
    },
    {
      id: "3",
      avatar: `data:image/svg+xml;base64,${randomAvatar3}`,
      name: "机智的狐狸",
      intro: "设计能力很强",
    },
    {
      id: "4",
      avatar: `data:image/svg+xml;base64,${randomAvatar4}`,
      name: "老实的北极熊 ",
      intro: "服从安排",
    },
    {
      id: "5",
      avatar: `data:image/svg+xml;base64,${randomAvatar5}`,
      name: "勤恳的飞鸟 ",
      intro: "擅长文档撰写",
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
          班级队伍 / Teams in Class
        </button>
        <button className="function-btn my-team">
          <span role="img" aria-label="people">👥</span>
          我的队伍 / My Team
        </button>
        <button className="function-btn match-result">
          <span role="img" aria-label="envelope">📄</span>
          入队邀请 / Team Invitations
        </button>
        {/* <div className="function-btn placeholder">
          <span role="img" aria-label="loudspeaker">📢</span>
          <span className="swipe-hint">招募板 / Recruitment Board</span>
        </div> */}
        <button onClick={openRecruitmentModal} className="function-btn match-result">
          <span role="img" aria-label="loudspeaker">📢</span>
          招募板 / Recruitment Board
        </button>
        <RecruitmentBoardModal
          isOpen={isRecruitmentModalOpen}
          onClose={closeRecruitmentModal}
          posts={recruitmentPosts}
        />
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
                邀请
              </button>
            </div>
          ))}
        </div>
        <span className="swipe-hint">
          <span role="img" aria-label="counterclockwise">🔄 </span>
          探索更多 / Explore More
        </span> 
      </div>

      {/* 课程要求区域 */}
      <div className="requirements-section">
        <div className="requirements-header">
          <h2>课程要求 / Course Requirements</h2>
          <span className="all-tag">展开全部 / Show All</span>
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

// 模拟招募数据
const recruitmentPosts = [
  {
    id: 1,
    title: '招前端',
    publisher: '海狮',
    content: '我们需要一名熟悉 React、Node.js 的前端开发工程师，负责新项目的用户界面开发...',
  },
  {
    id: 2,
    title: '招后端',
    publisher: 'xiaoming',
    content: '寻找有 Java 或 Python 开发经验的后端工程师，参与 API 的设计与开发...',
  },
  {
    id: 3,
    title: '招募UI/UX设计师',
    publisher: 'teamRed',
    content: '我们需要一位有创意和良好用户体验意识的 UI/UX 设计师，负责产品界面的视觉设计和用户体验优化...',
  },
  {
    id: 4,
    title: '招项目经理',
    publisher: 'King',  
    content: '寻找有项目管理经验，能够协调团队并按时交付的项目经理...',
  },
  // 可以添加更多招募信息
];

// 招募板弹窗组件
function RecruitmentBoardModal({ isOpen, onClose, posts }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        width: '80%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '20px', textAlign: 'center', width: '100%' }}>招募板</h3> {/* 标题居中并添加下边距 */}
      <div style={{ width: '100%' }}> {/* 包裹招募信息列表 */}
        {posts.map((post) => (
          <div key={post.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
            <h4>{post.title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#777' }}>发布者: {post.publisher}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        关闭
      </button>
    </div>
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
  display: flex; /* 使用 flexbox 布局 */
  flex-direction: row; /* 让子元素排列在一行 */
  justify-content: space-around; /* 子元素之间均匀分布 */
  gap: 1rem; /* 设置子元素之间的间距 */
  /* 如果按钮总宽度可能超出容器，可以考虑加上以下属性 */
  /* flex-wrap: wrap; */
}

.function-buttons .function-btn {
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column; /* 按钮内部元素垂直排列（图标在上，文字在下） */
  align-items: center;
  gap: 0.5rem;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: 0.3s ease-in-out;
  font-size: 1rem;
  color: #333;
  /* 可以根据需要设置按钮的宽度，例如平均分配 */
  flex: 1; /* 让按钮在行内平均分配宽度 */
}

.function-buttons .function-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #007bff;
}

.function-buttons .function-btn span[role="img"] {
  font-size: 1.5rem;
}

  /* 队员卡片区域 */
  .member-card-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中容器内的元素（包括 slider） */
  gap: 1rem;
  width: 100%; /* 可以设置容器的宽度，例如占据页面的 80% */
  margin: 0 auto; /* 水平居中容器自身 */
}

.member-card-container .member-card-slider {
  display: flex;
  flex-direction: row; /* 确保卡片横向排列 */
  justify-content: space-around; /* 使卡片均匀分布 */
  gap: 1rem; /* 设置子元素之间的间距 */
  width: 100%; /* 让 slider 占据容器的宽度 */
  padding: 0.5rem 0;
  /* 移除滚动条和相关样式，因为我们希望均匀分布而不是滚动 */
  overflow-x: visible;
  scroll-behavior: auto;
  cursor: auto;
  user-select: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &:active {
    cursor: auto;
  }
  .member-card {
    /* 移除固定宽度，让 flex-grow 生效 */
    flex: 1; /* 让卡片尽可能平均分配空间 */
    min-width: 0; /* 允许 flex-shrink 发生 */
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
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      width: 4rem;
      height: 2rem;
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

.member-card-container .swipe-hint {
  font-size: 0.8rem;
  color: #999;
  text-align: center; /* 让提示文字居中 */
}

/* 如果 member-card-container 需要在页面中部，可以调整其父容器的样式 */
/* body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
} */

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