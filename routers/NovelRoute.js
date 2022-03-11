import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import {NovelController} from '../controllers/NovelController.js';

const router = express.Router();

router.get('/', NovelController.GetNovels);

router.get('/novel/:url', NovelController.GetNovelsByUrl);

router.get('/novel/:url/mucluc', NovelController.GetChapterByUrl);

router.get('/novel/:url/chuong/:chapNumber',NovelController.GetChapterByNumber)

router.post('/novel/reading/',NovelController.SetReading)

router.get('/readings',NovelController.GetReadings)


export default router;