import { ResponseData,ResponseDetail } from "../services/ResponseJSON.js";
import jwt_decode from 'jwt-decode'
import { Chapter } from "../models/Chapter.js";
import { Novel } from "../models/Novel.js";
import { User } from "../models/User.js";
import { Bill } from "../models/Bill.js";
import { compareAsc, format } from 'date-fns'
export const StatisticController = {
    getCountChapters: async(req,res)=>{
        try {
            const countNumberOfChapter=await Chapter.countDocuments()
            return res.status(200).json(ResponseData(200,{chapterNumber:countNumberOfChapter}))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    getCountNovels: async(req,res)=>{
        try {
            const countNumberOfNovel=await Novel.countDocuments()
            return res.status(200).json(ResponseData(200,{novelNumber:countNumberOfNovel}))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    getCountAccounts: async(req,res)=>{
        try {
            const countNumberOfAccount=await User.countDocuments()
            return res.status(200).json(ResponseData(200,{accountNumber:countNumberOfAccount}))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    getListBills: async(req,res) => {
        try{
            let listPayments= await Bill.find().populate('userId')
            listPayments=listPayments.map(item=>{return {
                orderId:item.orderId,
                name:item.userId.nickname,
                amount:item.amount,
                description:item.description,
                status:item.status,
                createdAt: item.createdAt
            }})
            return res.status(200).json(ResponseData(200,listPayments))
        }catch(error){
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    getListBillByUser: async(req,res) => {
        try{
            const username = req.user?.sub
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json(ResponseDetail(400,{message:"Không xác định tài khoản"}))
            }
            let listPayments= await Bill.find({userId:user.id})
           
            listPayments=listPayments.map(item=>{return {
                id:item.id,
                orderId:item.orderId,
                name:item.userId.nickname,
                amount:item.amount,
                description:item.description,
                status:item.status,
                method:item.method,
                updatedAt: item.updatedAt
            }})
            return res.status(200).json(ResponseData(200,listPayments))
        }catch(error){
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    getSumRevenue: async(req,res)=>{
        try{
            let listPayments= await Bill.find()
            var tempTotalRevenue=0
            listPayments.forEach((item,index)=>{
                tempTotalRevenue+=item.amount
            })
            return res.status(200).json(ResponseData(200,{totalRevenue:tempTotalRevenue}))
        }catch(error){
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    GetTotalRevenueByDay: async (req, res) => {
        try{
            let listPayments= await Bill.find()
            listPayments=listPayments.map(item=>{
                return {
                    item,
                    dateAdd:format(item.createdAt, 'yyyy-MM-dd')
                }
            })
            var result = [];
            listPayments.reduce(function(res, value) {
            if (!res[value.dateAdd]) {
                res[value.dateAdd] = { dateAdd: value.dateAdd, amount: 0 };
                result.push(res[value.dateAdd])
            }
            res[value.dateAdd].amount += value.item.amount;
            return res;
            }, {});

            return res.status(200).json(ResponseData(200,result))
        }catch(error){
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    GetTotalCreateNovelByDay: async (req, res) => {
        try {
            let listNovels= await Novel.find()
            listNovels=listNovels.map(item=>{
                return {
                    item,
                    dateAdd:format(item.createdAt, 'yyyy-MM-dd')
                }
            })
            var result = [];
            listNovels.reduce(function(res, value) {
            if (!res[value.dateAdd]) {
                res[value.dateAdd] = { dateAdd: value.dateAdd, sum: 0 };
                result.push(res[value.dateAdd])
            }
            res[value.dateAdd].sum++;
            return res;
            }, {});

            return res.status(200).json(ResponseData(200,result))
            
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },
    GetTotalNewUserByDay: async (req, res) => {
        try{
            let listUsers= await User.find()
            listUsers=listUsers.map(item=>{
                if(item._doc.hasOwnProperty('createdAt')){
                    return {
                        item,
                        dateAdd:format(item.createdAt, 'yyyy-MM-dd')
                    }
                }
                return {
                    item,
                    dateAdd:"2022-04-08"
                }
            })
            var result = [];
            listUsers.reduce(function(res, value) {
            if (!res[value.dateAdd]) {
                res[value.dateAdd] = { dateAdd: value.dateAdd, sum: 0 };
                result.push(res[value.dateAdd])
            }
            res[value.dateAdd].sum++;
            return res;
            }, {});

            return res.status(200).json(ResponseData(200,result))
        }catch(error){
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
}