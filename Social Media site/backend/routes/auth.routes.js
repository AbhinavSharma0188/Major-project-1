import express from 'express';
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from '../controllers/auth.controllers.js';



const authrouter=express.Router();
authrouter.post('/signup',signUp)
authrouter.post('/signin',signIn)
authrouter.get('/signout',signOut)

authrouter.post('/sendOtp',sendOtp)
authrouter.post('/verifyOtp',verifyOtp)
authrouter.post('/resetPassword',resetPassword)

export default authrouter