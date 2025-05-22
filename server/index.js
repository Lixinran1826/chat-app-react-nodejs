const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// 启用调试和监听
mongoose.set("debug", true);
mongoose.connection.on("connected", () => console.log("🟢 MongoDB 已连接"));
mongoose.connection.on("error", (err) => console.error("🔴 MongoDB 错误:", err));
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  // .connect(process.env.MONGO_URL, {
  .connect("mongodb://localhost:27017/chat", { // 硬编码数据库名
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// const server = app.listen(process.env.PORT, () =>
//   console.log(`Server started on ${process.env.PORT}`)
// );
const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
