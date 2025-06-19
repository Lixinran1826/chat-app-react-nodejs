import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client"; // 引入 socket.io-client
import Chat from "./Chat"; // 假设 Chat.js 在同一目录下
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import BackgroundImage from '../assets/bg_mln.jpg';
import Logout from "../components/Logout"; 

const userAvatar =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM4ODgiLz4KPHBhdGggZD0iTTI1IDE1QTYgNiAwIDEgMCAyNSAyNUE2IDYgMCAxIDAgMjUgMTVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNSAzNUgyNUE5IDkgMCAwIDAgMzQgMjZIMTZDMTYgMzEgMTUgMzUgMTUgMzVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==';

export default function TaskAssignment() {
  const navigate = useNavigate();
  const socket = useRef(); // 创建 socket 引用
  
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined); // 统一用户状态
  
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  const [selectedTab, setSelectedTab] = useState("progress");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileTree, setFileTree] = useState([
    { id: "1", name: "项目 1 / Project 1", level: 0 },
    { id: "1.1", name: "项目 1.1 / Project 1.1", level: 1 },
    { id: "2", name: "项目 2 / Project 2", level: 0 },
    { id: "3", name: "项目 3 / Project 3", level: 0 },
    { id: "3.1", name: "项目 3.1 / Project 3.1", level: 1 },
  ]);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedParentFolder, setSelectedParentFolder] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [assignments, setAssignments] = useState([
    { id: "1", name: "第一次作业 / Assignment 1", description: "完成React项目 / Complete React Project", uploadedFile: null },
    { id: "2", name: "第二次作业 / Assignment 2", description: "提交Node.js作业 / Submit Node.js Assignment", uploadedFile: null },
    { id: "3", name: "第三次作业 / Assignment 3", description: "提交最终作业 / Submit All Assignment", uploadedFile: null },
  ]);
 // 【新增】判断是否可以提交的 state

  useEffect(() => {
  document.documentElement.style.height = "auto";
  document.documentElement.style.overflowY = "auto";
  document.body.style.height = "auto";
  document.body.style.overflowY = "auto";
}, []);


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


  // 初始化 socket 并绑定用户
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
    // 清理 socket 连接
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  // 文件勾选处理
  const handleFileSelect = (fileId) => {
    const file = fileTree.find((f) => f.id === fileId);
    let newSelectedFiles = [...selectedFiles];

    if (newSelectedFiles.includes(fileId)) {
      newSelectedFiles = newSelectedFiles.filter((id) => id !== fileId);
      if (file.level === 0) {
        const childFiles = fileTree.filter(
          (f) => f.level === 1 && f.id.startsWith(fileId)
        );
        childFiles.forEach((child) => {
          newSelectedFiles = newSelectedFiles.filter((id) => id !== child.id);
        });
      }
    } else {
      newSelectedFiles.push(fileId);
      if (file.level === 0) {
        const childFiles = fileTree.filter(
          (f) => f.level === 1 && f.id.startsWith(fileId)
        );
        childFiles.forEach((child) => {
          if (!newSelectedFiles.includes(child.id)) {
            newSelectedFiles.push(child.id);
          }
        });
      }
      if (file.level === 1) {
        const parentId = fileId.split(".")[0];
        const parentFile = fileTree.find((f) => f.id === parentId);
        const childFiles = fileTree.filter(
          (f) => f.level === 1 && f.id.startsWith(parentId)
        );
        const allChildrenSelected = childFiles.every((child) =>
          newSelectedFiles.includes(child.id)
        );
        if (allChildrenSelected && !newSelectedFiles.includes(parentId)) {
          newSelectedFiles.push(parentId);
        }
      }
    }

    setSelectedFiles(newSelectedFiles);
  };

  // 下载按钮点击事件（模拟）
  const handleDownload = () => {
    if (selectedFiles.length === 0) {
      alert("请先选择文件 / Please select files first.");
      return;
    }
    alert(`已下载以下文件 / Downloaded the following files:\n${selectedFiles.map((id) => fileTree.find((file) => file.id === id).name).join("\n")}`);
  };

  // 新建文件夹处理
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert("文件夹名称不能为空 / Folder name cannot be empty.");
      return;
    }
    const newFolder = {
      id: `${Date.now()}`,
      name: `${newFolderName} / ${newFolderName}`,
      level: 0,
    };
    setFileTree((prev) => [...prev, newFolder]);
    setNewFolderName("");
    setShowNewFolderInput(false);
  };

  // 上传文件处理（共享文件夹模块）
  const handleUploadFile = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const newFiles = Array.from(files).map((file, index) => {
      const parentId = selectedParentFolder || "root";
      const newFileId = `${parentId}.${Date.now()}.${index}`;
      return {
        id: newFileId,
        name: `${file.name} / ${file.name}`,
        level: selectedParentFolder ? 1 : 0,
      };
    });

    setFileTree((prev) => [...prev, ...newFiles]);
    event.target.value = null;
  };

  // 作业提交上传文件处理（单个文件）
  const handleSubmitUpload = (assignmentId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, uploadedFile: file.name }
          : assignment
      )
    );

    setUploadedFileName(file.name);
    event.target.value = null;
  };

    // 计算作业提交比例
  const submittedCount = assignments.filter((assignment) => assignment.uploadedFile !== null).length;
  const totalCount = assignments.length;
  const submittedPercentage = totalCount === 0 ? 0 : (submittedCount / totalCount) * 100;
  const remainingPercentage = 100 - submittedPercentage;

  const handleFinalSubmit = () => {
    alert("已成功提交所有作业文件！");
    navigate("/AssignmentSubmited");
    // 可以在这里发请求或执行提交逻辑
  };

  // 选择父级文件夹
  const handleSelectParentFolder = (fileId) => {
    const file = fileTree.find((f) => f.id === fileId);
    if (file.level === 0) {
      setSelectedParentFolder(fileId === selectedParentFolder ? null : fileId);
    }
  };

  // 删除文件/文件夹
  const handleDeleteFile = (fileId) => {
    const file = fileTree.find((f) => f.id === fileId);
    const confirmDelete = window.confirm(
      `确定要删除 "${file.name}" 吗？ / Are you sure you want to delete "${file.name}"?`
    );
    if (!confirmDelete) return;

    let newFileTree = fileTree.filter((f) => f.id !== fileId);
    if (file.level === 0) {
      newFileTree = newFileTree.filter((f) => !f.id.startsWith(fileId));
    }

    let newSelectedFiles = selectedFiles.filter((id) => id !== fileId);
    if (file.level === 0) {
      newSelectedFiles = newSelectedFiles.filter((id) => !id.startsWith(fileId));
    }

    if (selectedParentFolder === fileId) {
      setSelectedParentFolder(null);
    }

    setFileTree(newFileTree);
    setSelectedFiles(newSelectedFiles);
  };
  
  /* Chat*/
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    
    <OuterContainer>

    <Container>
      {/* 顶部区域 */}
      <div className="header">
        <button className="back-button" onClick={() => navigate("/teamspace")}>
          ←
        </button>
        <button className="back-button" onClick={() => navigate('/AssignmentSubmited')}>
            →
          </button>
        <div className="title">
          <h1>小组空间 / Team Space</h1>
          <h2>现代软件开发方法 / Modern Software Development</h2>
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

      {/* 导航标签路径 */}
      <div className="breadcrumb">
        <span >创建队伍 / Create Team</span> &gt;
        <span className="active">任务分工 / Task Assignment </span> &gt;
        <span>任务提交 / Task Submission</span> &gt;
        <span>评分反馈 / Feedback</span>
      </div>

     
      {/* 任务上传按钮 */}
      <div className="function-buttons">
        <button
          className={`function-btn ${selectedTab === "submit" ? "active" : ""}`}
          onClick={() => {
            setSelectedTab("submit");
            setShowSubmitModal(true);
          }}
        >
          <span role="img" aria-label="upload">📤</span>
          作业提交 / Assignment Submission
        </button>
        <div className="progress-pie">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* 背景圆（未提交部分） */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="20"
            />
            {/* 已提交部分 */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#28a745"
              strokeWidth="20"
              strokeDasharray={`${submittedPercentage * 2.51327} ${remainingPercentage * 2.51327}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            {/* 中心文字 */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy=".3em"
              fontSize="20"
              fill="#333"
            >
              {submittedCount}/{totalCount}
            </text>
          </svg>
          <span className="progress-label">作业进度 / Assignment Progress</span>
        </div>
        
      </div>


      {/* 作业提交模态窗口 */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>作业提交 / Assignment Submission</h2>
            <div className="assignment-list">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <React.Fragment key={assignment.id}> {/* 或者使用 <> </> */}
                    <div className="assignment-item"> {/* 这个是浅灰色卡片 */}
                      <div className="assignment-details">
                        <h3>{assignment.name}</h3>
                        <p>{assignment.description}</p>
                      </div>
                      <div className="assignment-upload">
                        <label className="upload-label">
                          <span role="img" aria-label="upload">📤</span>
                          上传 / Upload
                          <input
                            type="file"
                            multiple={false}
                            onChange={(e) => handleSubmitUpload(assignment.id, e)}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    </div>
                    {/* 文件名显示在卡片下方 */}
                    {assignment.uploadedFile && (
                      <div className="uploaded-file-container"> {/* 新的容器，用于控制文件名的对齐和间距 */}
                        <span className="uploaded-file-name">{assignment.uploadedFile}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <EmptyStateContainer> {/* 新增：空状态提示容器 */}
                  <p>暂无作业 / No assignments available.</p>
                </EmptyStateContainer>
              )}
            </div>
            <div className="modal-footer">
            <button className="close-button" onClick={() => setShowSubmitModal(false)}>
              关闭 / Close
            </button>

                {remainingPercentage === 0 ? (
                  <button className="final-submit-button" onClick={handleFinalSubmit}>
                    📤 提交所有 / Submit All
                  </button>
                ) : (
                  <span className="submit-placeholder">
                    上传所有作业方可提交
                  </span>
                )}
              </div>

          </div>
        </div>
      )}

      {/* 聊天框区域 */}
        <TeamChatContainer>
          <div className="teamAssignChatcontainer">
            <Contacts contacts={contacts} changeChat={handleChatChange} />
            {currentChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} />
            )}
          </div>
        </TeamChatContainer>
      
      {/* <div className="chat-section">
        <h2>WeTeam</h2>
        <Chat externalSocket={socket.current} />
      </div> */}

      {/* 共享文件夹模块 */}
      <div className="shared-folder-section">
        <div className="shared-folder-header">
          <span role="img" aria-label="folder">📁</span>
          <h2>共享文件夹 / Shared Folder</h2>
        </div>
        <div className="folder-actions">
          <button
            className="action-button"
            onClick={() => setShowNewFolderInput(!showNewFolderInput)}
          >
            <span role="img" aria-label="new-folder">📂</span>
            新建文件夹 / New Folder
          </button>
          <label className="action-button">
            <span role="img" aria-label="upload">📤</span>
            上传文件 / Upload File
            <input
              type="file"
              multiple
              onChange={handleUploadFile}
              style={{ display: "none" }}
            />
          </label>
          {/* Moved Download button here and changed its class */}
          <button className="action-button" onClick={handleDownload}> {/* Changed class to action-button */}
            <span role="img" aria-label="download">⬇️</span>
            下载 / Download
          </button>
        </div>
        {showNewFolderInput && (
          <div className="new-folder-input">
            <input
              type="text"
              placeholder="请输入文件夹名称 / Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button onClick={handleCreateFolder}>创建 / Create</button>
            <button onClick={() => setShowNewFolderInput(false)}>取消 / Cancel</button>
          </div>
        )}
        <div className="file-tree">
          {fileTree.map((file) => (
            <div
              key={file.id}
              className={`file-item ${selectedParentFolder === file.id ? "selected-parent" : ""}`}
              style={{ paddingLeft: `${file.level * 1.5}rem` }}
              onClick={() => handleSelectParentFolder(file.id)}
            >
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => handleFileSelect(file.id)}
              />
              <span>{file.name}</span>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                }}
              >
                <span role="img" aria-label="delete">🗑️</span>
              </button>
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

  /* 功能标签栏 */
  .tabs {
    display: flex;
    gap: 1rem;
    .tab {
      background-color: #f0f0f0;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 1rem;
      color: #666;
      transition: 0.3s ease-in-out;
      &:hover {
        background-color: #e0e0e0;
      }
    }
    .active {
      background-color: #007bff;
      color: white;
      &:hover {
        background-color: #0056b3;
      }
    }
  }
  /* 任务功能按钮 */
  .function-buttons {
    display: flex;
    gap: 1rem;
    .function-btn {
      background-color: #f9f9f9;
      border-radius: 2rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: 0.3s ease-in-out;
      font-size: 1rem;
      color: #333;
      border: none; 
      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        color: #007bff;
      }
      .upload-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        span[role="img"] {
          font-size: 1.2rem;
        }
      }
      .uploaded-file-name {
        margin-left: 1rem;
        font-size: 1rem;
        color: #333;
        border: none; 
      }
      &:hover .uploaded-file-name {
        color: #007bff;
      }
    }
    .active {
      background-color: #f9f9f9;
      color: #007bff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      &:hover {
        background-color: #f9f9f9;
        color: #007bff;
      }
      .uploaded-file-name {
        color: white;
      }
      &:hover .uploaded-file-name {
        color: white;
      }
    }
  }

  /* 模态窗口 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
    
  
    /* 作业提交 */
  .modal-content {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 2rem;
    width: 90%;
    max-width: 650px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0 0 1rem;
    }
    .assignment-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .assignment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f9f9f9;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        .assignment-details {
          flex: 1;
          h3 {
            font-size: 1.2rem;
            color: #333;
            margin: 0 0 0.5rem;
          }
          p {
            font-size: 0.9rem;
            color: #666;
            margin: 0;
          }
        }
        .assignment-upload {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          .upload-label {
            background-color: #f9f9f9;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: none; 
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            font-size: 1rem;
            color: #333;
            transition: 0.3s ease-in-out;
            &:hover {
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              color: #007bff;
            }
            span[role="img"] {
              font-size: 1.2rem;
            }
          }
        }
      }

    /* 提交的作业 */
      .uploaded-file-container {
        text-align: right; /* 文件名右对齐 */
        padding: 8px 15px; /* 根据需要调整内边距，使其与卡片视觉对齐 */
        margin-bottom: 15px; /* 与下一个作业项的间距 */
        font-size: 0.2em;
        color: #333;
        .uploaded-file-name{
          font-size: 0.5em;
        }
      }
    }

    
    .modal-footer {
      display: flex;
      justify-content: space-between;  /* 左右对齐 */
      align-items: center;
      margin-top: 20px;
    }
  
    .close-button {
      margin-top: 1rem;
      background-color: #ff6b6b;
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 1rem;
      transition: 0.3s ease-in-out;
      &:hover {
        background-color: #e55a5a;
      }
    }
  }
        .final-submit-button {
      margin-top: 1rem;
      background-color:rgb(69, 190, 184);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 1rem;
      transition: 0.3s ease-in-out;
      &:hover {
        background-color:rgb(14, 113, 115);
      }
    }
  }  
    /* 聊天框区域 */
    .chat-section {
      h2 {
        font-size: 1.0rem;
        color: #333;
        margin-bottom: 0rem;
      }
      > div {
        height: 500px; /* 默认高度 */
        min-height: 300px; /* 最小高度 */
        max-height: 600px; /* 最大高度 */
        width: 95%; /* 宽度自适应 */
        background-color: #f9f9f9;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        align-items: center;
        overflow: auto; /* 必须设置 overflow: auto 才能使用 resize */
        resize: vertical; /* 允许垂直拉伸 */
        .container {
          height: 100%;
          width: 100%;
          background-color: #f9f9f9;
          border-radius: 0.5rem;
          display: grid;
          grid-template-columns: 25% 75%;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
          }
        }
      }
    }

  /* 共享文件夹模块 */
  .shared-folder-section {
    .shared-folder-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      span[role="img"] {
        font-size: 1.5rem;
      }
      h2 {
        font-size: 1.5rem;
        color: #333;
        margin: 0;
      }
    }
    .folder-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      .action-button {
        background-color: #f9f9f9;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        font-size: 1rem;
        color: #333;
        transition: 0.3s ease-in-out;
        border: none;
        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          color: #007bff;
        }
        span[role="img"] {
          font-size: 1.2rem;
        }
      }
    }
    .new-folder-input {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #333;
        &::placeholder {
          color: #999;
        }
      }
      button {
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          background-color: #0056b3;
        }
        &:last-child {
          background-color: #ff6b6b;
          &:hover {
            background-color: #e55a5a;
          }
        }
      }
    }
    .file-tree {
      background-color: #f9f9f9;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &::-webkit-scrollbar {
        width: 0.4rem;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 0.2rem;
      }
      .file-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        input[type="checkbox"] {
          cursor: pointer;
        }
        span {
          font-size: 1rem;
          color: #333;
          flex: 1;
        }
        .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #ff6b6b;
          transition: 0.3s ease-in-out;
          &:hover {
            color: #e55a5a;
          }
        }
      }
      .selected-parent {
        background-color: #e0e0e0;
        border-radius: 0.3rem;
      }
    }
    .download-button {
      margin-top: 1rem;
      background-color: #f9f9f9;
      color: black;
      border: none;
      border-radius: 0.5rem;
      padding: 0.8rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: 0.3s ease-in-out;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &:hover {
        background-color: #f9f9f9;
      }
      span[role="img"] {
        font-size: 1.2rem;
      }
    }
  }
`;

const TeamChatContainer = styled.div`
  width: 100%; /* 适配 Container 的宽度，受 OuterContainer 限制 */
  height: 50vh; /* 保留原始高度 */
  min-height: 40vh; /* 最小高度 */
  max-height: 70vh; /* 最大高度 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  background-color: rgba(79, 45, 45, 0.27);
  overflow: auto;
  resize: vertical;
  border-radius: 1rem;
  box-sizing: border-box;

  .teamAssignChatcontainer {
    width: 100%; /* 填充父容器 */
    height: 100%;
    background-color: rgba(255, 255, 255, 0.46);
    display: grid;
    grid-template-columns: 25% 75%;
    overflow: hidden;
    border-radius: 1rem;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

const TeamChatContainer2 = styled.div`
  height: 85vh; /* 从 85vh 缩小到 70vh */
  width: 70vw; /* 从 85vw 缩小到 70vw */

  min-height: 50vh; /* 最小高度 */
  max-height: 70vh; /* 最大高度 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  background-color: rgba(79, 45, 45, 0.27);
  overflow: hidden;
  resize: vertical;
  border-radius: 1rem;

  .teamAssignChatcontainer {
  height: 85vh; /* 从 85vh 缩小到 70vh */
  width: 70vw; /* 从 85vw 缩小到 70vw */
    min-height: 50vh; /* 最小高度 */
    max-height: 70vh; /* 最大高度 */
    width: 70vw; /* 与父容器保持一致 */
    background-color: rgba(255, 255, 255, 0.46);
    display: grid;
    grid-template-columns: 25% 75%;
    overflow: hidden;
    border-radius: 1rem;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 1rem 0;
  text-align: center;
  color: #777;
  font-style: italic;
  background-color: #f9f9f9; /* 可选的淡背景色 */
  border-radius: 0.5rem; /* 可选的圆角 */
  min-height: 100px; /* 给一个最小高度，避免太空 */

  p {
    margin: 0;
  }
`;