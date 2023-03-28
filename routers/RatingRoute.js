import express from 'express';

import { RatingController } from '../controllers/RatingController.js';
import {verifyToken} from "../controllers/middlewareController.js"

const router = express.Router();

router.post('/', verifyToken, RatingController.CreateRating);

router.get('/:url', RatingController.GetRatingByUrl);

router.delete('/', verifyToken, RatingController.DeleteRating);

export default router;