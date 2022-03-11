import mongoose from 'mongoose'

const schema =new  mongoose.Schema({
    tentruyen:{
        type: String,
        require: true,
    },
    tacgia:{
        type: String,
        require: true,
    },
    theloai:{
        type: String,
        require: true,
    },
    danhgia:{
        type: Number,
        require: true,
        default:0
    },
    luotdoc:{
        type: Number,
        require: true,
        default:0
    },
    hinhanh:{
        type: String,
        require: true,
    },
    nguoidangtruyen:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    noidung:{
        type: String,
        require: true,
        default:"Truyện đọc"
    },
    soluongdanhgia:{
        type: Number,
        require: true,
        default:0
    },
    trangthai:{
        type: String,
        require: true,
        default:"Đang ra"
    },
    url:{
        type: String,
        require: true
    },
    sochap:{
        type:Number,
        required:true,
        default:0
    }
},
{timestamps:true}
)

export const Novel = mongoose.model('Novel', schema)