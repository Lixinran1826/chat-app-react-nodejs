// components/AddCourseForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

function AddCourseForm({ onSubmit, onCancel }) {
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    location: '',
    schedule: [{ dayOfWeek: 1, startTime: '09:00', endTime: '11:00' }], // 默认一个时段
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedule = [...courseData.schedule];
    newSchedule[index] = { ...newSchedule[index], [name]: value };
    setCourseData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleBlock = () => {
    setCourseData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' }]
    }));
  };

  const removeScheduleBlock = (index) => {
    const newSchedule = courseData.schedule.filter((_, i) => i !== index);
    setCourseData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 基本验证
    if (!courseData.name || !courseData.location) {
      toast.error("课程名称和地点为必填项！");
      return;
    }
    for (const s of courseData.schedule) {
      if (!s.dayOfWeek || !s.startTime || !s.endTime) {
        toast.error("所有课程计划的日期和时间都为必填项！");
        return;
      }
      // 可以添加更复杂的时间格式验证或时间逻辑验证（如开始时间早于结束时间）
      if (s.startTime >= s.endTime) {
        toast.error("开始时间必须早于结束时间！");
        return;
      }
    }
    onSubmit(courseData);
  };

  return (
    <AddCourseFormStyled>
      <form onSubmit={handleSubmit}>
        <h2>新增课程</h2>
        <div className="form-group">
          <label htmlFor="name">课程名称 / Course Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            required
            maxLength="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">地点 / Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={courseData.location}
            onChange={handleInputChange}
            required
            maxLength="200"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">描述 / Description:</label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            maxLength="500"
          />
        </div>

        <div className="schedule-section">
          <h3>课程计划 / Schedule:</h3>
          {courseData.schedule.map((s, index) => (
            <div key={index} className="schedule-block">
              <div className="schedule-row">
                <label>星期:</label>
                <select
                  name="dayOfWeek"
                  value={s.dayOfWeek}
                  onChange={(e) => handleScheduleChange(index, e)}
                  required
                >
                  <option value={1}>周一</option>
                  <option value={2}>周二</option>
                  <option value={3}>周三</option>
                  <option value={4}>周四</option>
                  <option value={5}>周五</option>
                  <option value={6}>周六</option>
                  <option value={7}>周日</option>
                </select>
                <label>开始时间:</label>
                <input
                  type="time" // HTML5 time input
                  name="startTime"
                  value={s.startTime}
                  onChange={(e) => handleScheduleChange(index, e)}
                  required
                />
                <label>结束时间:</label>
                <input
                  type="time" // HTML5 time input
                  name="endTime"
                  value={s.endTime}
                  onChange={(e) => handleScheduleChange(index, e)}
                  required
                />
                {courseData.schedule.length > 1 && (
                  <button type="button" className="remove-schedule" onClick={() => removeScheduleBlock(index)}>
                    -
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="add-schedule-button" onClick={addScheduleBlock}>
            + 添加上课时间段
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">取消</button>
          <button type="submit" className="submit-button">创建课程</button>
        </div>
      </form>
    </AddCourseFormStyled>
  );
}

const AddCourseFormStyled = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 700px; /* 适当增加表单宽度 */
  margin: 2rem auto; /* 居中显示 */
  z-index: 1000; /* 确保在其他内容之上 */
  position: relative; /* 必要时调整定位 */

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  .form-group {
    margin-bottom: 1.2rem;
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #555;
    }
    input[type="text"],
    textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      box-sizing: border-box; /* 确保 padding 不增加宽度 */
      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    }
    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }

  .schedule-section {
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding-top: 1.5rem;

    h3 {
      font-size: 1.4rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .schedule-block {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .schedule-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.8rem;
      flex-wrap: wrap; /* 允许在小屏幕上换行 */

      label {
        font-weight: normal;
        margin-bottom: 0; /* 重置 label 默认 margin */
        flex-shrink: 0; /* 防止 label 被压缩 */
      }
      
      select, input[type="time"] {
        padding: 0.6rem 0.8rem;
        border: 1px solid #ccc;
        border-radius: 0.4rem;
        font-size: 0.95rem;
        flex-grow: 1; /* 让输入框填充可用空间 */
        min-width: 100px; /* 最小宽度 */
      }

      .remove-schedule {
        background-color: #dc3545; /* 红色 */
        color: white;
        border: none;
        padding: 0.5rem 0.8rem;
        border-radius: 0.4rem;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
        &:hover {
          background-color: #c82333;
        }
      }
    }

    .add-schedule-button {
      background-color: #17a2b8; /* 蓝色 */
      color: white;
      border: none;
      padding: 0.7rem 1.2rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #138496;
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;

    button {
      padding: 0.8rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.1rem;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .cancel-button {
      background-color: #6c757d;
      color: white;
      border: none;
      &:hover {
        background-color: #5a6268;
      }
    }

    .submit-button {
      background-color: #007bff;
      color: white;
      border: none;
      &:hover {
        background-color: #0056b3;
      }
    }
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem auto;

    h2 {
      font-size: 1.6rem;
    }

    .form-group label {
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.6rem;
      font-size: 0.9rem;
    }

    .schedule-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;

      label {
        width: 100%;
      }

      select, input[type="time"] {
        width: 100%;
      }

      .remove-schedule {
        width: 100%;
      }
    }

    .add-schedule-button {
      width: 100%;
      justify-content: center;
    }

    .form-actions {
      flex-direction: column;
      gap: 0.8rem;
      button {
        width: 100%;
      }
    }
  }
`;

export default AddCourseForm;