
import express from 'express';
import {AdminController} from '../controllers/AdminController.js';
import { AuthController } from '../controllers/AuthController.js';
import {verifyToken, verifyTokenAdmin} from "../controllers/middlewareController.js"

const router = express.Router();
router.put('/user/active',verifyTokenAdmin,AdminController.activeByAdmin);

router.put('/user/inactive',verifyTokenAdmin,AdminController.inactiveByAdmin);

router.put('/role/updatetouser',verifyTokenAdmin,AdminController.updateRoles)

router.get('/users',verifyTokenAdmin,AuthController.LoadUsers);
export default router