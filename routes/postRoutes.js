import express from "express";
import { protect } from "../middlewares/auth.js";
import { checkObjectId } from "../middlewares/checkObjectId.js";
import { check } from "express-validator";
import {
  createPost,
  getAllPost,
  getPostById,
  postLiked,
  unlikePost,
  deletePost,
  commentPost,
  deleteComment,
} from "../controllers/postController.js";

const router = express.Router();

router.post(
  "/",
  [protect, [check("text", "Text is required").not().isEmpty()]],
  createPost
);

router.get("/", protect, getAllPost);
router.get("/:id", protect, checkObjectId("id"), getPostById);
router.delete("/:id", [protect, checkObjectId("id")], deletePost);
router.put("/like/:id", protect, checkObjectId("id"), postLiked);
router.put("/unlike/:id", protect, checkObjectId("id"), unlikePost);
router.post(
  "/comment/:id",
  protect,
  checkObjectId("id"),
  check("text", "Text is required").notEmpty(),
  commentPost
);
router.delete("/comment/:id/:comment_id", protect, deleteComment);

export default router;