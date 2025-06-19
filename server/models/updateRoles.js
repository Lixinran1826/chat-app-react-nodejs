// updateRoles.js
// 这是一个脚本，用于更新 MongoDB 中用户的角色
// 如果用户没有 role 字段，则将其设置为 'student'，如果有则不做任何更改。
const mongoose = require('mongoose');
const User = require('./userModel'); 

const MONGODB_URI='mongodb://localhost:27017/chat';

async function updateExistingUserRoles() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for update script.');

    // 更新所有没有 role 字段的用户，将其 role 设置为 'student'
    const result = await User.updateMany(
      { role: { $exists: false } }, // 查找 role 字段不存在的文档
      { $set: { role: 'student' } } // 将其 role 设置为 'student'
    );

    console.log(`Successfully updated ${result.modifiedCount} users with default role 'student'.`);

    // 如果需要将所有用户的 role 都设置为 'student'，可以使用以下代码：
    // const result = await User.updateMany({}, { $set: { role: 'student' } });
    // console.log(`Successfully updated ${result.modifiedCount} users with role 'student'.`);

  } catch (error) {
    console.error('Error updating user roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

updateExistingUserRoles();