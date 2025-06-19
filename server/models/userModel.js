const mongoose = require("mongoose"); // Import mongoose to interact with MongoDB

const userSchema = new mongoose.Schema({ // Define the schema for user data
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  role: { 
    type: String,
    enum: ['student', 'teacher', 'administrator'], 
    default: 'student', 
    required: true, 
  },
}, { timestamps: true }); // Add timestamps to the schema for createdAt and updatedAt fields

module.exports = mongoose.model("Users", userSchema); // Export the user model to be used in other parts of the application
// This model will be used to interact with the 'users' collection in MongoDB