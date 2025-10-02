import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectdb from './config/db.js';
import authrouter from './routes/auth.routes.js';
import loopRouter from './routes/loop.routes.js';
import messageRouter from './routes/message.routes.js';
import postRouter from './routes/posts.routes.js';
import storyRouter from './routes/story.routes.js';
import userrouter from './routes/user.routes.js';
import { app, server } from './socket.js';

dotenv.config();

// ✅ CORS must come FIRST, before any other middleware
app.use(cors({
  origin: "https://vybe-svus.onrender.com", 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Add this
  allowedHeaders: ['Content-Type', 'Authorization'] // Add this
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authrouter);
app.use('/api/user', userrouter);
app.use('/api/post', postRouter);
app.use('/api/loop', loopRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', messageRouter);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("hello");
});

server.listen(port, () => {
    connectdb();
    console.log("Server is listening");
});
