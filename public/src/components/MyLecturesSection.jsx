// components/MyLecturesSection.jsx
import React from 'react';
import styled from 'styled-components';

function MyLecturesSection({ courses, onAddCourseClick, onCourseCardClick }) {
  // 辅助函数，将 dayOfWeek 数字转换为星期名称
  const getDayName = (dayNum) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayNum % 7]; // 确保 7 映射到周日，1映射到周一
  };

  return (
    <MyLecturesSectionStyled>
      <div className="section-header">
        <h2>我的授课 / My Lectures</h2>
        <button className="add-course-button" onClick={onAddCourseClick}>
          <span>+</span> 新增课程
        </button>
      </div>

      <div className="course-cards-container">
        {courses.length === 0 && <p className="no-courses">暂无授课课程。点击 "新增课程" 添加。</p>}
        {courses.map((course) => (
          <div key={course._id} className="course-card" onClick={() => onCourseCardClick(course._id)}>
            <div className="course-info">
              <h3>{course.name}</h3>
              <p className="course-location">地点: {course.location}</p>
              <div className="course-schedule">
                {course.schedule && course.schedule.length > 0 ? (
                  course.schedule.map((s, index) => (
                    <span key={index} className="schedule-item">
                      {getDayName(s.dayOfWeek)} {s.startTime}-{s.endTime}
                      {index < course.schedule.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  <span className="schedule-item">暂无课程安排</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MyLecturesSectionStyled>
  );
}

const MyLecturesSectionStyled = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin: 0;
  }

  .add-course-button {
    background-color: #28a745; /* 绿色按钮 */
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #218838;
    }

    span {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  .no-courses {
    text-align: center;
    color: #888;
    padding: 2rem;
    font-size: 1.1rem;
  }

  .course-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 响应式网格布局 */
    gap: 1.5rem;
  }

  .course-card {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      background-color: #eaf0f6; /* 悬停背景色变化 */
    }

    h3 {
      font-size: 1.4rem;
      color: #007bff; /* 课程名称颜色 */
      margin-top: 0;
      margin-bottom: 0.8rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .course-location {
      font-size: 0.95rem;
      color: #6c757d;
      margin-bottom: 0.6rem;
    }

    .course-schedule {
      font-size: 0.9rem;
      color: #495057;
      line-height: 1.4;
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem; /* 多个时间段之间的小间距 */
    }

    .schedule-item {
        background-color: #e2f0e6; /* 浅绿色背景 */
        padding: 0.3em 0.6em;
        border-radius: 0.3rem;
        font-size: 0.85rem;
        color: #28a745; /* 绿色文本 */
    }
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    padding: 1rem;

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .add-course-button {
      width: 100%;
      justify-content: center;
    }

    .course-cards-container {
      grid-template-columns: 1fr; /* 小屏幕下堆叠显示 */
    }
  }
`;

export default MyLecturesSection;