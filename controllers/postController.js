import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id).select("-password");

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  });

  const post = await newPost.save();
  if (post) {
    res.json(post);
  } else {
    res.status(500);
    throw new Error("Server Error");
  }
});

const getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  if (posts) {
    res.json(posts);
  } else {
    res.status(404);
    throw new Error("Posts not found");
  }
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.user.equals(req.user.id)) {
      await post.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Not authorized");
    }
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const postLiked = asyncHandler(async (req, res) => { 
  {
    try {
      const post = await Post.findById(req.params.id);

      // Check if the post has already been liked
      if (post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Post already liked" });
      }

      post.likes.unshift({ user: req.user.id });

      await post.save();

      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

const unlikePost = asyncHandler(async (req, res) => {
  {
    try {
      const post = await Post.findById(req.params.id);

      // Check if the post has not yet been liked
      if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Post has not yet been liked" });
      }

      // remove the like
      post.likes = post.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );

      await post.save();

      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

const commentPost = asyncHandler(async (req, res) => {
  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  {
    try {
      const post = await Post.findById(req.params.id);

      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id.toString() === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: "Comment does not exist" });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      post.comments = post.comments.filter(
        ({ id }) => id.toString() !== req.params.comment_id
      );

      await post.save();

      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
});

export {
  createPost,
  getAllPost,
  getPostById,
  postLiked,
  commentPost,
  deleteComment,
  deletePost,
  unlikePost,
};
