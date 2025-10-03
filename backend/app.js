// server.js
const express = require("express");
const cors = require("cors");
require('dotenv').config()   
const path = require('path')

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.CORS_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// for image
app.use('/api/stu/uploads/image', express.static(path.join(__dirname, 'uploads/image')))

// for document
app.use('/api/stu/uploads/document', express.static(path.join(__dirname, 'uploads/document')))



app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});


// routes
app.use('/api/stu', require('./routes/student/studentRoutes'));
app.use('/api/table', require('./routes/timeTable/timetableRoutes'))
app.use('/api/section', require('./routes/classSection/sectionRoutes'))
app.use('/api/subject', require('./routes/classSubject/subjectRoutes'))
app.use('/api/subgroup' , require('./routes/classSubject/subejctGroupRoutes'))
app.use('/api/library', require('./routes/Library/libraryRoutes'))
app.use('/api/attendance', require('./routes/attendance/attendanceRoutes'))
app.use('/api/fees', require('./routes/StudentFees/feesRoutes'))
app.use('/api/exam', require('./routes/exam/examRoutes'))
app.use('/api/reason', require('./routes/academicReason/reasonRoutes'))
app.use('/api/class' , require('./routes/classes/classRoutes'))
app.use('/api/leave', require('./routes/leave/leaveRoutes'))
app.use('/api/parent', require('./routes/parent/parentRoutes'))
app.use('/api/teacher', require('./routes/teacher/teacherRoutes'))
app.use('/api/homework', require('./routes/homework/homeworkRoutes'))
app.use('/api/holiday' , require('./routes/holiday/holidayRoutes'))
app.use('/api/auth', require('./routes/Auth/authRoutes'))
app.use('/api/depart',require('./routes/department/departmentRoutes') )




app.listen(port, () => console.log(`✅ Server is running on port ${port}`));
