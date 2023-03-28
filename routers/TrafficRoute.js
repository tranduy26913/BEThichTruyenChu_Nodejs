import express from 'express';
import {verifyTokenAdmin} from "../controllers/middlewareController.js"
import { TrafficController } from '../controllers/TrafficController.js';

const router = express.Router();

router.post("/",TrafficController.updateTraffic);
router.get("/getAll",verifyTokenAdmin,TrafficController.getAllTraffic);

export default router