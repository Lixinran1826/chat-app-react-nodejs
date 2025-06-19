import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; 
import TeamSpace from "./pages/TeamSpace"; 
import TeamAssignment from "./pages/TeamAssignment"; 
import TeacherDashboard from "./pages/TeacherDashboard"; 
import AssignmentSubmited from "./pages/AssignmentSubmited"; // 新增

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* 新增 */}
        <Route path="/teamspace" element={<TeamSpace />} /> {/* 新增 */}
        <Route path="/teamassignment" element={<TeamAssignment />} /> {/* 新增 */}
        <Route path="/teacherDashboard" element={<TeacherDashboard />} /> {/* 教师端仪表盘 */}
        <Route path="/assignmentsubmited" element={<AssignmentSubmited />} /> {/* 新增 */}
      </Routes>
    </BrowserRouter>
  );
}

