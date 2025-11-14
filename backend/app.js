// server.js
const express = require("express");
const cors = require("cors");
require('dotenv').config()
const path = require('path')
const { Server } = require('socket.io')
const http = require('http')

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.CORS_URL,
  methods: ["GET", "POST", "PUT", "DELETE", 'PATCH'],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use('/api/chat/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));
// for image
app.use('/api/stu/uploads/image', express.static(path.join(__dirname, 'uploads/image')))

// for document
app.use('/api/stu/uploads/document', express.static(path.join(__dirname, 'uploads/document')))


// routes
app.use('/api/parentdashboard', require('./routes/parentDashboard/parentDashboard.routes'));
app.use('/api/studentdashboard', require('./routes/studentDashboard/studentDashboard.routes'));
app.use('/api/teacherdashboard', require('./routes/teacherDashboard/teacherDasboard.routes'));
app.use('/api/admindashboard', require('./routes/adminRoutes/admin.routes'));
app.use('/api/notification', require('./routes/notification/notification.router'));
app.use('/api/user', require('./routes/users/users.routes'));
app.use('/api/stu', require('./routes/student/studentRoutes'));
app.use('/api/table', require('./routes/timeTable/timetableRoutes'))
app.use('/api/section', require('./routes/classSection/sectionRoutes'))
app.use('/api/subject', require('./routes/classSubject/subjectRoutes'))
app.use('/api/subgroup', require('./routes/classSubject/subejctGroupRoutes'))
app.use('/api/library', require('./routes/Library/libraryRoutes'))
app.use('/api/attendance', require('./routes/attendance/attendanceRoutes'))
app.use('/api/fees', require('./routes/StudentFees/feesRoutes'))
app.use('/api/exam', require('./routes/exam/examRoutes'))
app.use('/api/reason', require('./routes/academicReason/reasonRoutes'))
app.use('/api/class', require('./routes/classes/classRoutes'))
app.use('/api/leave', require('./routes/leave/leaveRoutes'))
app.use('/api/parent', require('./routes/parent/parentRoutes'))
app.use('/api/teacher', require('./routes/teacher/teacherRoutes'))
app.use('/api/homework', require('./routes/homework/homeworkRoutes'))
app.use('/api/holiday', require('./routes/holiday/holidayRoutes'))
app.use('/api/auth', require('./routes/Auth/authRoutes'))
app.use('/api/depart', require('./routes/department/departmentRoutes'))
app.use('/api/designation', require('./routes/designation/designationRoutes'))
app.use('/api/staff', require('./routes/staff/staffRoutes'))
app.use('/api/hostel', require('./routes/hostel/hostelListRoutes'))
app.use('/api/transport', require('./routes/transports/transports.routes'))
app.use('/api/salary', require('./routes/payment_salary/paymentSalaryRoutes'))
app.use('/api/sport', require('./routes/sports/sportsRoutes'))
app.use('/api/account', require('./routes/accounts/accountsRoutes'))
app.use('/api/chatusers', require('./routes/chat/chatUsersRoutes'))
app.use('/api/chat', require('./routes/chat/chatRoutes'))
app.use('/api/message', require('./routes/chat/messageRoutes'))
app.use('/api/faq', require('./routes/faq/faqRoutes'))
app.use('/api/testimonials', require('./routes/testimonials/testimonialsRoutes'))

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});


const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  },
})
app.set('io', io)
require('./socket/socketHandler')(io)


server.listen(port, () => console.log(`✅ Server is running on port ${port}`));
