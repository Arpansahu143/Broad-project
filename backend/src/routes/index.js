import { Router } from "express";

import authRoutes from "../modules/auth/index.js";
import studentRoutes from "../modules/student/index.js";
import departmentRoutes from "../modules/department/index.js";
import facultyRoutes from "../modules/faculty/index.js";
import courseRoutes from "../modules/course/index.js";
import attendanceRoutes from "../modules/attendance/index.js";
import notificationRoutes from "../modules/notification/index.js";
import reportRoutes from "../modules/report/index.js";
import examRoutes from "../modules/exam/index.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "University MIS Backend Running",
  });
});

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/departments", departmentRoutes);
router.use("/faculty", facultyRoutes);
router.use("/courses", courseRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/exams", examRoutes);

export default router;