import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import {AuthController} from "../controllers/AuthController.js"
import { UserController } from '../controllers/UserController.js';

import {CloneChapter, CloneNovel} from '../services/cloneDB.js'
const router = express.Router();

router.get('/info', verifyToken, UserController.getInfo);

router.put('/info',verifyToken, UserController.updateUser);

router.put('/info/password',verifyToken, UserController.updatePassword);

router.get('/getusers',verifyToken,AuthController.LoadUsers);

router.get('/chapter',CloneChapter)

export default router;