import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import { SavedController } from '../controllers/SavedController.js';

const router = express.Router();

router.post("/",verifyToken,SavedController.createdSaved);

router.get("/",verifyToken,SavedController.getSavedsByUser);

router.get("/:url",verifyToken,SavedController.checkSavedByUser);

router.delete("/",verifyToken,SavedController.deleteSaved);

export default router