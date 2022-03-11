import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import {verifyToken} from "../controllers/middlewareController.js"

const router = express.Router();

router.post('/auth/register', AuthController.RegisterUser);

router.post('/auth/login', AuthController.LoginUser);

router.get('/getusers',verifyToken,AuthController.LoadUsers);

router.post('/auth/refreshtoken',AuthController.RefreshToken);

router.post('/auth/reactive',AuthController.ReActive);

router.post('/auth/active',AuthController.Active);

export default router;