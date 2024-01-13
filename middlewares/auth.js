import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from '../models/userModel.js'

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err)
    res.status(401)
    throw new Error('Not authorized, token failed')

  }
})