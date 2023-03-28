import { Novel } from "../models/Novel.js"
import { ResponseDetail, ResponseData } from "../services/ResponseJSON.js"
import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js'
import mongoose from "mongoose"
import { Rating } from "../models/Rating.js"


export const RatingController = { 
    CreateRating: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            var username;
            if (token) {
                username = jwt_decode(token).sub
            }
            const content = req.body.content
            const rating = req.body.rating
            const novelurl = req.body.url
            
            if(username) {
                const user = await User.findOne({ username })
                if (user) {
                    const novel = await Novel.findOne({ url: novelurl })
                    const newrating = new Rating({userId: user._id, novelId: novel._id, rating: rating, content: content })
                    await newrating.save()

                    const ratings =  await Rating.find({novelId:novel._id})
                    const totalRating =  await Rating.countDocuments({novelId:novel._id})
                    const totalrating = ratings.reduce((total, current) => {return total+current.rating},0) / ratings.length

                    novel.rating = totalrating;
                    novel.numberofrating = totalRating
                    await novel.save()
                    return res.status(200).json(ResponseData(200, "Gửi đánh giá thành công"))
                }
            }
            return res.status(400).json(ResponseDetail(400, { message: "Yêu cầu đăng nhập để có thể gửi đánh giá" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi hệ thống" }))
        }
    },

    GetRatingByUrl: async (req, res) => {
        try {
            const url = req.params.url
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                let ratings = await Rating.find({
                    novelId: novel._id}).sort({createdAt:-1}).populate('userId')
                ratings=ratings.map(item=>{return {
                    nickname:item.userId.nickname,
                    image:item.userId.image,
                    content:item.content,
                    id:item.id,
                    username:item.userId.username,
                    rating: item.rating,
                    createdAt:item.createdAt,
                }})
                return res.status(200).json(ResponseData(200, ratings))
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi hệ thống" }))
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
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi hệ thống" }))
        }
    }

}
