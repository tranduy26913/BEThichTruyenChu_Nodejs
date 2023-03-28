import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { ResponseData, ResponseDetail } from "../services/ResponseJSON.js";
import { Role } from "../models/Role.js";
import { Novel } from "../models/Novel.js";
import {Bill} from "../models/Bill.js";
import { Comment } from "../models/Comment.js";
import { Rating } from "../models/Rating.js";
import { sendMail } from "../services/EmailService.js";
import mongoose from "mongoose";
import generator from "generate-password"

export const AdminController = {
    activeByAdmin: async (req, res) => {
       try {
           const userId = req.body.userId;
           const updateUser = await User.findByIdAndUpdate(userId, { active: true }, { new: true }).populate('roles')
   
           if (updateUser)
               return res.status(200).json(ResponseData(200, updateUser))
           return res.status(400).json(ResponseDetail(400, {message:"Kích hoạt thất bại"}))
       }
       catch (error) {
           console.log(error)
           return res.status(500).json(ResponseDetail(500, { message: "Lỗi cập nhật quyền tài khoản" }))
       }
   },
   inactiveByAdmin: async (req, res) => {
       try {
           const userId = req.body.userId;
           const updateUser = await User.findByIdAndUpdate(userId, { active: false }, { new: true }).populate('roles')
           if (updateUser)
               return res.status(200).json(ResponseData(200, updateUser))
           return res.status(400).json(ResponseDetail(400,  {message:"Khoá thất bại"}))
       }
       catch (error) {
           console.log(error)
           return res.status(500).json(ResponseDetail(500, { message: "Lỗi cập nhật quyền tài khoản" }))
       }
   },
   updateRoles:async(req,res)=>{
        try{
            const rolesRequest = req.body.roles;
            const username = req.body.username;
            let roles=[]
            const getRoles =async(list)=>{
                const roles=[]
                for(let i=0;i<list.length;i++){
                    let role = await Role.findOne({name:list[i]})
                roles.push(role)
                }
                return roles
            }
            roles = await getRoles(rolesRequest)
            if(username){
                const newUser=await User.updateOne({username},{roles:roles.map(item=>item.id)},{new:true})
                if(newUser){
                    return res.status(200).json(ResponseData(200,{message:"Cập nhật quyền thành công"}))
                }
                else
                    return res.status(400).json(ResponseDetail(400,{message:"Cập nhật không thành công"}))
            }else
                return res.status(400).json(ResponseDetail(400,{message:"Không có username"}))
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi cập nhật quyền tài khoản"}))
        }
    },

    deleteAccount: async(req,res)=>{
        try {
            const userId = req.body.userId;
            const updateUser = await User.findByIdAndUpdate( userId, { isDeleted: true })
            if (updateUser)
            {
                updateUser['isDeleted']=true
                return res.status(200).json(ResponseData(200, updateUser))
            }
                
            return res.status(400).json(ResponseDetail(400, {message:"Xóa tài khoản thất bại"}))
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi xóa tài khoản" }))
        }
    },
    deleteNovelById: async(req,res) => {
        try {
            const novelId = req.body.novelId
            const novel = await Novel.findOne({ _id: novelId })
            if (novel) {
                const response = await Novel.deleteOne({ _id: novel._id })
                if (response.deletedCount == 1)
                    return res.status(200).json(ResponseData(200, { message: "Xoá truyện thành công" }))
                return res.status(400).json(ResponseDetail(400, { message: "Xoá truyện không thành công" }))

            }
            else
                return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },
    GetListUser: (req, res) => {
        try {

            User.find().sort({ name: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                }).
                catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetUsers" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetUsers" }))
        }
    },
    GetNovels: (req, res) => {
        try {

            Novel.find().sort({ name: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                }).
                catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },
    GetBills: async (req, res) => {
        try{
            let listPayments= await Bill.find().populate('userId').populate('orderId')
            // listPayments=listPayments.map(item=>{return {
            //     orderId:item.orderId,
            //     name:item.userId.nickname,
            //     amount:item.amount,
            //     description:item.description,
            //     status:item.status,
            //     createdAt: item.createdAt
            // }})
            return res.status(200).json(ResponseData(200,listPayments))
        }catch(error){
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Không xác định"}))
        }
    },
    GetUserById: async (req,res)=>{
        try {
            const userId=req.body.userId
            const user =await User.findOne({_id:userId}).populate("roles");

            return res.status(200).json(ResponseData(200,{userInfo:user}))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500,{message:"Lỗi xác thực"}))
        }
    },
    inactiveWithIdByAdmin: async (req, res) => {
        try {
            const userId = req.body.userId;
            const updateUser = await User.findOneAndUpdate({ userId:userId }, { active: false }, { new: true }).populate('roles')
            if (updateUser)
                return res.status(200).json(ResponseData(200, updateUser))
            return res.status(400).json(ResponseDetail(400,  {message:"Khoá thất bại"}))
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi cập nhật quyền tài khoản" }))
        }
    },
    updateDeleteStatus: async (req,res) => {
        try {
            const username = req.body.username;
            const updateUser = await User.findOneAndUpdate( {username:username}, { isDeleted: false })
            if (updateUser)
            {
                updateUser['isDeleted']=true
                return res.status(200).json(ResponseData(200, updateUser))
            }
                
            return res.status(400).json(ResponseDetail(400, {message:"Xóa tài khoản thất bại"}))
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi xóa tài khoản" }))
        }
    },
    GetListOfComments: async (req, res) => {
        try {
            let comments = await Comment.find().sort({createdAt:-1}).populate('userId').populate('novelId')
                return res.status(200).json(ResponseData(200, comments))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },
    GetListRating: async (req, res) => {
        try {
            let ratings = await Rating.find().sort({createdAt:-1}).populate('userId').populate('novelId')
                return res.status(200).json(ResponseData(200, ratings))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },
    DeleteRating: async (req, res) => {
        try {
            const ratingid = req.query.id
            console.log(ratingid)
            const rate = await Rating.findById(ratingid)
            const novel =  await Novel.findOne({_id: rate.novelId})
            const count = await Rating.findByIdAndDelete(ratingid)
            const total = await Rating.find({novelId: novel._id})
            novel.numberofrating = total.length
            await novel.save()
            if(count) 
                return res.status(200).json(ResponseData(200, {message:"Xoá thành công"}))
            else {
                return res.status(400).json(ResponseDetail(400, { message: 'Xoá thất bại' }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi xoá comment" }))
        }
    },
    DeleteComment: async (req, res) => {
        try {
            const commentId = req.query.id
            const count = await Comment.findByIdAndDelete(commentId)
            if(count) 
                return res.status(200).json(ResponseData(200, {message:"Xoá thành công"}))
            else {
                return res.status(400).json(ResponseDetail(400, { message: 'Xoá thất bại' }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi xoá comment" }))
        }
    },
    GetNovelCommentRatings: async (req,res)=>{
        try {
            let novels = await Novel.find().populate('uploader')
            let ratings = await Rating.find().sort({createdAt:-1}).populate('userId')
            let comments = await Comment.find().sort({createdAt:-1}).populate('userId')
            novels=novels.map((item,index)=>{
                let tempListRatings=ratings.filter((value)=>{
                   return value.novelId.toString()===item.id.toString() 
                })
                let tempListComments=comments.filter((value)=>{
                    return value.novelId.toString()===item.id.toString() 
                 })
                return {
                    ...item._doc,
                    comments:tempListComments,
                    ratings:tempListRatings,
                }
            })
                return res.status(200).json(ResponseData(200, novels))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },
    GetNovelReviewById: async(req,res)=>{
        try {
            const novelId = req.body.novelId
            const novel = await Novel.findOne({ _id: novelId })
            if (novel) {
                let ratings = await Rating.find({novelId: novel._id}).populate('userId')
                let comments = await Comment.find({novelId: novel._id}).populate('userId')
                let resultReviewNovel={
                    ...novel._doc,
                    ratings:ratings,
                    comments:comments,
                }
                return res.status(200).json(ResponseData(200,{reviewNovelInfo:resultReviewNovel}))
            }
            else
                return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },
    GetNovelReviewByUrl: async(req,res)=>{
        try {
            const url = req.body.url
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                let ratings = await Rating.find({novelId: novel._id}).populate('userId')
                let comments = await Comment.find({novelId: novel._id}).populate('userId')
                let resultReviewNovel={
                    ...novel._doc,
                    ratings:ratings,
                    comments:comments,
                }
                return res.status(200).json(ResponseData(200,{reviewNovelInfo:resultReviewNovel}))
            }
            else
                return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    }
} 