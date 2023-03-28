import express from 'express';
import {verifyToken, verifyTokenAdmin} from "../controllers/middlewareController.js"
import { StatisticController } from '../controllers/StatisticController.js';

const router = express.Router();
router.get('/countChapters',verifyTokenAdmin,StatisticController.getCountChapters);

router.get('/countNovels',verifyTokenAdmin,StatisticController.getCountNovels);

router.get('/countAccounts',verifyTokenAdmin,StatisticController.getCountAccounts);

router.get('/get-bill-byuser',verifyToken,StatisticController.getListBillByUser);

router.get('/sumTotalRevenue',verifyTokenAdmin,StatisticController.getSumRevenue)

router.get('/bills/getTotalRevenueByDay',verifyTokenAdmin,StatisticController.GetTotalRevenueByDay)

router.get('/novels/getTotalCreateNovelByDay',verifyTokenAdmin,StatisticController.GetTotalCreateNovelByDay)

router.get('/user/getTotalNewUserByDay',verifyTokenAdmin,StatisticController.GetTotalNewUserByDay)
export default router