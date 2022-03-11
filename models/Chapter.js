import mongoose from 'mongoose'

const schema =new  mongoose.Schema({
    chapnumber:{
        type: Number,
        require: true,
        default:0
    },
    content:{
        type: String,
        require: true,
        default:""
    },
    tenchap:{
        type: String,
        require: true,
    },
    dautruyenId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel"
    },
},
{timestamps:true}
)

export const Chapter = mongoose.model('Chapter', schema)