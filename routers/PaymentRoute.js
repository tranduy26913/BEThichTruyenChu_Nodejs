import express from 'express';
import { PaymentController } from '../controllers/PaymentController.js';
import {verifyToken} from "../controllers/middlewareController.js"
const router = express.Router();

router.post('/create-payment', PaymentController.createPayment);
router.post('/result-payment', PaymentController.ipn);

router.post('/create-vnp-payment',verifyToken, PaymentController.CreatePaymentVNPay);
router.get('/result-vnp-payment', PaymentController.VNPayIPN);

export default router;