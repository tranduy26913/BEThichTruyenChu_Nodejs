import { Novel } from "../models/Novel.js";
import {Saved} from "../models/Saved.js"
import { ResponseData } from "../services/ResponseJSON.js";
import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js'

export const SavedController = {
    createdSaved:async(req,res)=>{
        try {
             const token = req.headers.authorization.split(" ")[1];
            const url = req.body.url
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })
            if(user){
                const novel =await Novel.findOne({url:url})
                if(novel){
                    const saved = await new Saved({
                        user:user._id,
                        novel:novel._id
                    })
                    await saved.save()
                    return res.status(200).json(ResponseData(200,"Lưu thành công"))
                }
                else
                    return res.status(401).json(ResponseData(401,"Không tìm thấy truyện"))
            }
            else{
                return res.status(401).json(ResponseData(401,"Không tìm thấy tài khoản"))
            }
        } catch (error) {
            return res.status(500).json(ResponseData(500,"Lỗi lưu truyện"))
        }
    },
    
    checkSavedByUser:async(req,res)=>{
        try {
            const token = req.headers.authorization.split(" ")[1];
            const url = req.params.url
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })
            if(user){
                const novel =await Novel.findOne({url:url})
                if(novel){
                    const saved =await Saved.findOne({
                        user:user._id,
                        novel:novel._id
                    })
                    if(saved)
                        return res.status(200).json(ResponseData(200,{saved:true}))
                    else
                        return res.status(200).json(ResponseData(200,{saved:false}))
                }
                else
                    return res.status(401).json(ResponseData(401,"Không tìm thấy truyện"))
            }
            else{
                return res.status(401).json(ResponseData(401,"Không tìm thấy tài khoản"))
            }
        } catch (error) {
            return res.status(500).json(ResponseData(500,"Lỗi lưu truyện"))
        }
    },
    getSavedsByUser:async(req,res)=>{
        try {
            const token = req.headers.authorization.split(" ")[1];
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })

            if(user){
                var saveds = await Saved.find({user:user._id}).populate("novel")
                console.log(saveds)
                saveds = saveds.map(item=>{
                    return {
                        tentruyen:item.novel.tentruyen,
                        hinhanh:item.novel.hinhanh,
                        url:item.novel.url,
                        tacgia:item.novel.tacgia
                            }
                })
                return res.status(200).json(ResponseData(200,saveds))
            }
            else{
                return res.status(401).json(ResponseData(401,"Không tìm thấy tài khoản"))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseData(500,"Lỗi lưu truyện"))
        }
    },

    deleteSaved:async(req,res)=>{
        try {
             const token = req.headers.authorization.split(" ")[1];
            const url = req.body.url
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })
            if(user){
                const novel =await Novel.findOne({url:url})
                if(novel){
                    await Saved.deleteOne({user:user._id,novel:novel._id})
                    return res.status(200).json(ResponseData(200,"Xoá thành công"))
                }
                else
                    return res.status(401).json(ResponseData(401,"Không tìm thấy truyện"))
            }
            else{
                return res.status(401).json(ResponseData(401,"Không tìm thấy tài khoản"))
            }
        } catch (error) {
            return res.status(500).json(ResponseData(500,"Lỗi xoá truyện"))
        }
    }
}