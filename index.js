import express from "express";
import path from 'path'
import cors from "cors";
import { connect } from "./config/db.js";
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import profileRoutes from './routes/profileRoutes.js'

dotenv.config()
connect()

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) =>{
  app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
})

app.listen(5000, () => {
  console.log("app is listening on port 5000");
});
