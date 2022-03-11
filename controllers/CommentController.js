import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js';
import { ResponseDetail, ResponseData } from '../services/ResponseJSON.js';
import { Novel } from '../models/Novel.js'
import { Comment } from '../models/Comment.js';

export default CommentController = {
    CreateComment: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const content = req.body.content
            const url = req.body.url
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })
            if (user) {
                const novel = await Novel.findOne({ url: url })
                if (novel) {
                    const comment = await new Comment({
                        dautruyenId: novel.id,
                        userId: user.id,
                        content
                    })
                    const cmtResponse = await comment.save()

                    return res.status(200).json(ResponseData(200, cmtResponse))
                } else {
                    return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
                }
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }
        } catch (error) {
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },
    GetCommentsByUrl: async (req, res) => {
        try {
            const url = req.body.url

            const novel = await Novel.findOne({ url: url })
            if (novel) {
                const comments = await Comment.find({dautruyenId:})
                const cmtResponse = await comment.save()

                return res.status(200).json(ResponseData(200, cmtResponse))
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }

        } catch (error) {
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    }
}