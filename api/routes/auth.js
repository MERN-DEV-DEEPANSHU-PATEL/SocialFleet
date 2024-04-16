import express from "express";
import {
  login,
  register,
  logout,
  SendOtp,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getotp", SendOtp);
router.post("/logout", logout);

export default router;
