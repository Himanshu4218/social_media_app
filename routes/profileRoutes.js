import express from 'express'
import { protect } from "../middlewares/auth.js";
import { check } from "express-validator";
import {
  getAllUsers,
  getUserProfile,
  getUserGithub,
  updateUserProfile,
  getProfileById,
  addProfileExperience,
  deleteProfile,
  deleteProfileEducation,
  deleteProfileExperience,
  addProfileEducation,
} from "../controllers/profileController.js";
 
const router = express.Router();

router.get("/me", protect, getUserProfile);
router.post(
  "/",
  [
    protect,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  updateUserProfile
);

router.get("/", getAllUsers);

router.get("/user/:user_id", getProfileById);

router.delete("/",protect, deleteProfile);

router.put(
  "/experience",
  [ 
    protect,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  addProfileExperience
);

router.delete("/experience/:exp_id", protect, deleteProfileExperience);

router.put(
  "/education",
  [
    protect,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  addProfileEducation
);

router.delete("/education/:edu_id", protect, deleteProfileEducation);

router.get("/github/:username", getUserGithub);

export default router;