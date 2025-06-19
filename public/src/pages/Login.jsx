import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo_p5r.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import BackgroundImage from '../assets/bg_mln.jpg'; // 新增背景图

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/");
  //   }
  // }, []);

  useEffect(() => {
    // 检查用户是否已登录，并根据角色跳转
    const checkUserRoleAndRedirect = async () => {
      const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));// 获取 localStorage 中的用户信息
      if (user) {
        // 根据 localStorage 中存储的用户角色进行跳转
        if (user.role === 'teacher') {
          navigate("/TeacherDashboard");
        } else if (user.role === 'student') {
          navigate("/Dashboard");
        } else {
          // 其他角色或默认情况
          navigate("/Dashboard");
        }
      }
    };
    checkUserRoleAndRedirect();
  }, [navigate]); // 依赖项中添加 navigate

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      console.log("API 返回:", data);
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        localStorage.setItem(
          process.env.REACT_APP_TOKEN_KEY, // 确保这个环境变量名称正确，例如 REACT_APP_AUTH_TOKEN_KEY
          data.token // 确保 data.token 有值
        );
        console.log("localStorage 内容:", localStorage.getItem("currentUser"));
        navigate(data.redirect); // 根据后端返回的路径进行跳转
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="cs_logo" />
            <h1>ICAMPUS</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

// 新增 OuterContainer 样式，包裹整个页面
const OutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  // background-color:rgb(245, 245, 245); /* 可选：添加背景色以区分 */
  background-image: url(${BackgroundImage}); /* 设置背景图 */
  background-size: cover; /* 铺满容器 */
  background-position: center; /* 居中 */
  background-repeat: no-repeat; /* 不重复 */
  padding: 2rem;
  box-sizing: border-box;

  /* 限制最大宽度，防止页面过度拉伸 */
  max-width: 1440px; /* 可根据需要调整，例如 1280px 或 1600px */
  margin: 0 auto; /* 水平居中 */
`;


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  // background-color:rgba(222, 210, 224, 0.34);
  background-image: url(${BackgroundImage}); /* 设置背景图 */
  background-size: cover; /* 铺满容器 */
  background-position: center; /* 居中 */
  background-repeat: no-repeat; /* 不重复 */
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color:rgb(94, 156, 116);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color:rgb(145, 99, 155);
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color:rgb(154, 71, 237);
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
