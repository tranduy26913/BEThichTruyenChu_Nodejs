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
        default:"Truyện đọc",
        validate:{
            validator:item=>{
                return item.length > 10
            },
            message:"Nội dung phải dài hơn 10 kí tự"
        }
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
        require: true,
    },
    sochap:{
        type:Number,
        required:true,
        default:0
    }
},
{timestamps:true}
)

schema.pre('deleteOne', { query: true, document: false },function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    let id=this.getQuery()['_id'];
    Comment.deleteMany({dautruyenId: id}).exec();
    Reading.deleteMany({dautruyenId:id}).exec();
    Chapter.deleteMany({dautruyenId:id}).exec();
    next();
});

export const Novel = mongoose.model('Novel', schema)