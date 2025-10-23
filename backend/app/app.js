import express from "express";
import cors from "cors";
import db from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import globalRoutes from "./routes/global.routes.js";
// import parentRoutes from "./routes/parent.routes.js";
// import homeworkRoutes from "./routes/homework.routes.js";
// import examRoutes from "./routes/exam.routes.js";
// import noticeRoutes from "./routes/notice.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

console.log(process.env.JWT_SECRET);

db.getConnection()
  .then(() => console.log("MySQL Connected"))
  .catch((err) => console.error("DB Error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/global", globalRoutes);

app.use("/api/student", studentRoutes);
app.use("/api/parent", parentRoutes);

// app.use("/api/parent", parentRoutes);
// app.use("/api/homework", homeworkRoutes);
// app.use("/api/exam", examRoutes);
// app.use("/api/notice", noticeRoutes);


const PORT = 3005;
app.listen(PORT, () => console.log(`✅ App backend running on port ${PORT}`));
