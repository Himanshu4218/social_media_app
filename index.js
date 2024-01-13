import express from "express";
import path from 'path'
import cors from "cors";
import {fileURLToPath} from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, 'frontend', 'dist')));

app.get('*', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
})

app.listen(5000, () => {
  console.log("app is listening on port 5000");
});
