import { Router } from "express";

import authRoutes from "../modules/auth/index.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "University MIS Backend Running",
  });
});

router.use("/auth", authRoutes);

export default router;