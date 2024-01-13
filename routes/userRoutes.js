import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { check } from "express-validator";
const router = express.Router();

router
  .route("/")
  .post(
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    registerUser
  );
router.post(
  "/login",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  loginUser
);
router.route("/getuser").get(protect, getUser); 

export default router;
