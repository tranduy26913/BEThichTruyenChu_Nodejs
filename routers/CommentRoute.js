import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import {CommentController} from '../controllers/CommentController.js'
const router = express.Router();

router.post('/create', verifyToken, CommentController.CreateComment);

router.get('/getcomment/:url', CommentController.GetCommentsByUrl);

export default router;