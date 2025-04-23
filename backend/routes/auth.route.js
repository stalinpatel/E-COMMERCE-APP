import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);// DONE

router.post("/login", login);// DONE

router.post("/logout", logout);// DONE

router.post("/refresh-token", refreshToken);// DONE

router.get("/profile", getProfile);// DONE

export default router;
