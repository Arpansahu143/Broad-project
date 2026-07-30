import { Router } from "express";

import authRoutes from "../modules/auth/index.js";
import studentRoutes from "../modules/student/index.js";
import departmentRoutes from "../modules/department/index.js";
import facultyRoutes from "../modules/faculty/index.js";

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

export default router;