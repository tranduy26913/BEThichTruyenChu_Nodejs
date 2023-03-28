import crypto from 'crypto';
import https from 'https';
import moment from 'moment/moment.js';
import mongoose from 'mongoose';
import QueryString from 'qs';
import { Bill } from '../models/Bill.js';
import { User } from '../models/User.js';
// const frontendUrl = 'http://localhost:3000/'
// const backendUrl = 'http://localhost:5000/'
const frontendUrl = 'https://cnpmm.vercel.app/'
const backendUrl = 'https://becnpmm.vercel.app/'
export const PaymentController = {
    createPayment: async (req, res) => {
        try {

            //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
            //parameters
            var partnerCode = "MOMOQDD420220927";
            var accessKey = "yFRGoK0eLSrthX4Y";
            var secretkey = "tZNafmaHgldR8XfZA9wiYCFIkaXbzxbu";
            var requestId = partnerCode + new Date().getTime();
            var orderId = req.body.orderId;
            var orderInfo = "Thanh toán đơn hàng #" + orderId;
            var redirectUrl = frontendUrl + "result-payment";
            var ipnUrl = backendUrl + "api/payment/result-payment";
            //var ipnUrl ='https://playerhostedapitest.herokuapp.com/api/myorders';
            // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
            var amount = req.body.amount;
            var requestType = "captureWallet"
            var username = req.body.username;
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message:'Không tồn tài tài khoản'})
            }
            var extraData = Buffer.from(JSON.stringify({username})).toString('base64');
            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
            //puts raw signature
            console.log("--------------------RAW SIGNATURE----------------")
            console.log(rawSignature)
            //signature

            var signature = crypto.createHmac('sha256', secretkey)
                .update(rawSignature)
                .digest('hex');
            console.log("--------------------SIGNATURE----------------")
            console.log(signature)

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                extraData: extraData,
                requestType: requestType,
                signature: signature,
                lang: 'vi'
            });
            //Create the HTTPS objects
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            const newBill = new Bill({orderId,userId:user.id,amount,description:'Nạp tiền vào tài khoản',method:'Momo'})
            await newBill.save()
            let payUrl = ""
            //Send the request and get the response
            const reqPayment = https.request(options, response => {
                console.log(`Status: ${response.statusCode}`);
                console.log(`Headers: ${JSON.stringify(response.headers)}`);
                response.setEncoding('utf8');
                response.on('data', (body) => {
                    console.log('Body: ');
                    console.log(body);
                    console.log('payUrl: ');
                    console.log(JSON.parse(body).payUrl);
                    payUrl = JSON.parse(body).payUrl;
                });
                response.on('end', () => {
                    console.log('No more data in response.');
                    res.status(200).json({payUrl})
                });
            })

            reqPayment.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
            });
            // write data to request body
            console.log("Sending....")
            reqPayment.write(requestBody);
            reqPayment.end();
            
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({ error: "Lỗi tạo hoá đơn thanh toán. Vui lòng thực hiện lại thanh toán" });
        }
    },
    ipn: async (req, res) => {
        try {
            console.log(req.body)
            var resultCode = req.body.resultCode;
            var partnerCode = "MOMOQDD420220927";
            var accessKey = "yFRGoK0eLSrthX4Y";
            var secretkey = "tZNafmaHgldR8XfZA9wiYCFIkaXbzxbu";
            var orderId = req.body.orderId || req.query.orderId;
            var extraData = req.body.extraData;
            var amount = req.body.amount;
            var username = JSON.parse (Buffer.from(extraData,'base64').toString('ascii')).username;
            var statusPayment = resultCode === 0 ? "Thành công":"Thất bại"
            console.log(await Bill.findOneAndUpdate({orderId},{status:statusPayment},{new:true}))
            if(resultCode === 0){
                // write data to request body
                const user = await User.findOne({username: username});
                const balance = user.balance + amount;
                await User.findOneAndUpdate({username:username},{balance:balance})
            }
            return res.status(204).json({});
        }
        catch (e) {
            return res.status(500).json({ error: "Lỗi tạo hoá đơn thanh toán. Vui lòng thực hiện lại thanh toán" });
        }
    },
    CreatePaymentVNPay: async (req, res, next) => {
        try{

            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            if(ipAddr ==='::1')
                ipAddr ='127.0.0.1'
            let tmnCode = process.env.vnp_TmnCode;
            let secretKey = process.env.vnp_HashSecret;
            let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
            let returnUrl = backendUrl+"api/payment/result-vnp-payment"
            let date = new Date();
    
            let createDate =moment().format('YYYYMMDDHHmmss'); 
            var orderId = req.body.orderId;
            let username = req.user.sub
            let amount = req.body.amount;
            let bankCode = req.body.bankCode || '';
    
            let orderInfo = req.body.orderDescription || "Nang cap tai khoan "+username;
            let orderType = req.body.orderType || 'billpayment';
            let locale = req.body.language || 'vn';
            if (locale === null || locale === '') {
                locale = 'vn';
            }
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = orderType;
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
    
            //Tạo bill
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message:"Không tồn tại tài khoản"})
            }
            const newBill = await new Bill({
                orderId,
                userId:user.id,
                description:"Nâng cấp tài khoản bằng VNPay",
                amount,
                method:"VNPay"
            })
            await newBill.save()//lưu bill vào db
            vnp_Params['vnp_TxnRef'] = newBill.id.toString()
            vnp_Params = sortObject(vnp_Params);
    
           
            let signData = QueryString.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + QueryString.stringify(vnp_Params, { encode: false });
            console.log(vnpUrl)
            res.status(200).json({payUrl:vnpUrl})
        }
        catch(err){
            console.log(err)
            res.status(400).json({message:"Tạo hoá đơn không thành công. Vui lòng thử lại"})
        }
    },
    
    VNPayIPN:async(req, res, next)=>{
        try{
            let vnp_Params = req.query;
            let secureHash = vnp_Params['vnp_SecureHash'];
            let amount  = vnp_Params['vnp_Amount']/100
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];
        
            vnp_Params = sortObject(vnp_Params);
            let secretKey = process.env.vnp_HashSecret;
            let signData = QueryString.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
             let rspCode = vnp_Params['vnp_ResponseCode'];
            if(secureHash === signed){
                let orderId = vnp_Params['vnp_TxnRef'];
                
                console.log(rspCode);
                if(rspCode==='00')//giao dich thanh cong
                {
                    const bill = await Bill.findOneAndUpdate({_id:mongoose.Types.ObjectId(orderId)}
                    ,{status:'Thành công',transactionId:vnp_Params['vnp_TransactionNo']}
                    ,{new:true})
                    const user = await User.findById(bill.userId);
                    const balance = user.balance + amount;
                    await User.findByIdAndUpdate(bill.userId,{balance:balance})
                   
                    return res.redirect(`${frontendUrl}result-payment?resultCode=0?message=Giao dịch thành công`)
                }
                //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
                return res.redirect(`${frontendUrl}result-payment?resultCode=${rspCode}?message=Giao dịch không thành công`)
            }
            else {
                return res.redirect(`${frontendUrl}result-payment?resultCode=${rspCode}?message=Giao dịch không thành công`)
            }
        }
        catch(err){
            console.log(err)
            return res.redirect(`${frontendUrl}result-payment?resultCode=01?message=Xác nhận giao dịch không thành công`)
        }
    }

}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
