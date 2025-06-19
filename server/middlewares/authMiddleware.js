const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: "No token provided, authorization denied." });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // 验证 JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 将解码后的用户信息（包括 _id, username, role）添加到 req.user
    req.user = decoded;
    next();
  } catch (err) {
    // Token 过期、无效等错误
    console.error("JWT verification error:", err.message);
    return res.status(403).json({ msg: "Token is not valid or expired." });
  }
};

module.exports = verifyToken;