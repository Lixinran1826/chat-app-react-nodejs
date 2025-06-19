const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // 引入 jsonwebtoken 用于生成 JWT

// 注册逻辑
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body; // 确保接收 role 字段
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'student', // 如果前端没有传 role，默认为 'student'
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password; // 注册成功后不返回密码哈希

    return res.json({ status: true, user: userWithoutPassword });
  } catch (ex) {
    next(ex);
  }
};

// 登录逻辑
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    // 从用户对象中移除密码，避免发送给前端
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // ****** 生成 JWT Token ******
    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY, // 确保在 .env 中设置了 JWT_SECRET_KEY
      { expiresIn: '1h' } // Token 有效期
    );
    // ****************************

    // 根据用户角色决定前端跳转路径
    let redirectPath;
    if (user.role === 'teacher') {
      redirectPath = '/TeacherDashboard';
    } else if (user.role === 'student') {
      redirectPath = '/Dashboard';
    } else {
      redirectPath = '/Dashboard'; // 默认路径
    }

    // 将 token 返回给前端
    return res.json({
      status: true,
      user: userWithoutPassword,
      token: token, // 返回 JWT token
      redirect: redirectPath,
    });

  } catch (ex) {
    next(ex);
  }
};