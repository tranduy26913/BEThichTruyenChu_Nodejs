import { Novel } from "../models/Novel.js"
import { ResponseDetail, ResponseData } from "../services/ResponseJSON.js"
import { Chapter } from "../models/Chapter.js"
import jwt_decode from 'jwt-decode'
import { Reading } from '../models/Reading.js'
import { User } from '../models/User.js'

export const NovelController = {
    GetNovels: (req, res) => {
        try {
            const status = req.query.status || 'None'
            const sort = req.query.sort || 'tentruyen'
            const page = req.query.page || 0
            const size = req.query.size || 6

            Novel.find().limit(size).skip(size * page).sort({ tentruyen: -1 })
                .then(result => {
                    console.log(result)
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

    GetNovelsByUrl: async (req, res) => {
        try {
            const url = req.params.url;
            Novel.findOne({ url: url }).then(
                result => {
                    res.status(200).json(ResponseData(200, result))
                }
            ).
                catch(err => {
                    console.log(err)
                    res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin truyện" }))
        }
    },

    GetChapterByNumber: async (req, res) => {
        try {
            const chapNumber = req.params.chapNumber;
            const url = req.params.url

            const novel = await Novel.findOne({ url: url })
            if (novel) {
                Chapter.findOne({ dautruyenId: novel.id, chapnumber: chapNumber })
                    .then(
                        result => {
                            return res.status(200).json(ResponseData(200, result))
                        }
                    ).
                    catch(err => {
                        console.log(err)
                        return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy chap" }))
                    })
            }
            else {
                return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },

    GetChapterByUrl: async (req, res) => {
        try {
            const url = req.params.url;
            const page = req.query.page || 0
            const size = req.query.size || 1000
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                Chapter.find({ dautruyenId: novel.id })
                    .limit(size)
                    .skip(page * size)
                    .sort({ chapnumber: 1 })
                    .select({ chapnumber: 1, tenchap: 1 }).then(
                        result => {
                            return res.status(200).json(ResponseData(200, result))
                        }
                    ).
                    catch(err => {
                        console.log(err)
                        return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy chap" }))
                    })
            }
            else {
                return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    }

    ,
    SetReading: async (req, res) => {
        try {
            const chapNumber = req.body.chapNumber
            const url = req.body.url
            const token = req.headers.authorization?.split(" ")[1];
            const decode = jwt_decode(token)

            if (!decode.sub) {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi token" }))
            }
            const username = decode.sub;
            User.findOne({ username: username })
                .then(async (result) => {
                    const novel = await Novel.findOne({ url: url })
                    if (novel) {
                        
                        let reading = await Reading.findOne({
                            dautruyenId: novel.id,
                            userId: result.id
                        })
                        if(reading){
                            reading.chapNumber=chapNumber
                        }
                        else{
                            reading=await new Reading({
                                dautruyenId: novel.id,
                                userId: result.id,
                                chapNumber
                            })
                        }
                        const temp = await reading.save()
                        return res.status(200).json(ResponseData(200, temp))
                    }
                    return res.status(500).json(ResponseDetail(500, { message: "Không tìm thấy tài khoản" }))
                })
                .catch(err => {
                    return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm tài khoản" }))
                })
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },
    GetReadings: async(req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decode = jwt_decode(token)

            if (!decode.sub) {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi token" }))
            }
            const username = decode.sub;
            const user = await User.findOne({ username: username })
            if (user) {
                console.log(user)
                const readings = await Reading.find({ userId: user.id }).populate('dautruyenId')

                console.log(readings)
                return res.status(200).json(ResponseData(200, readings))
            } else {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm tài khoản" }))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    }

}