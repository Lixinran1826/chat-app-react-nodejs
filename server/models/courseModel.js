const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 100,
  },
  description: {
    type: String,
    max: 500,
  },
  location: {
    type: String,
    required: true,
    max: 200,
  },
  teacher:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  students: [ // students is an array of ObjectIds referencing the Users collection
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    }
  ],
  schedule: [ // schedule is an array of objects defining the course schedule
    {
      dayOfWeek: { // day of the week, 1 for Monday, 2 for Tuesday, ..., 7 for Sunday
        type: Number,
        required: true,
        min: 1,
        max: 7,
      },
      startTime: {// satart time of the class
        type: String,
        required: true,
        // regular expression to match time format HH:MM
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      endTime: { // 结束时间
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
    }
  ],
}, { timestamps: true }); // Add timestamps to the schema for createdAt and updatedAt fields

module.exports = mongoose.model("Courses", courseSchema); // Export the course model to be used in other parts of the application
// This model will be used to interact with the 'courses' collection in MongoDB