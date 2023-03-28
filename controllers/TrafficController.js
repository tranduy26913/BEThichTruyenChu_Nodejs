import { Novel } from "../models/Novel.js";
import { Saved } from "../models/Saved.js"
import { ResponseData } from "../services/ResponseJSON.js";
import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js'
import { Traffic } from "../models/Traffic.js";
import { compareAsc, format } from 'date-fns'
export const TrafficController = {
    updateTraffic: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            let username = ''
            if (token)
                username = jwt_decode(token).sub

            const user = await User.findOne({ username })

            const now = new Date()
            now.setHours(0)
            now.setMinutes(0)
            now.setSeconds(0)
            now.setMilliseconds(0)
            if (user) {
                await Traffic.findOneAndUpdate({ date: now }, { $inc: { count: 1, countUser: 1 } }, { upsert: true, new: true })
            }
            else {
                await Traffic.findOneAndUpdate({ date: now }, { $inc: { count: 1, countGuest: 1 } }, { upsert: true, new: true })
            }
            return res.status(200).json(ResponseData(200, { message: "Lưu thành công" }))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseData(500, "Lỗi lưu truyện"))
        }
    },
    getAllTraffic: async (req, res) => {
        try {
            let traffics = await Traffic.find()
            traffics=traffics.sort((a,b)=>new Date(a.date).getTime() -new Date(b.date).getTime())
            return res.status(200).json(ResponseData(200, { message: "Lưu thành công", traffics }))

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseData(500, "Lỗi lưu truyện"))
        }
    },


}