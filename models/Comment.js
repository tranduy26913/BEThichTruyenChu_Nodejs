import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    novelId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Novel"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    },
    
},{timestamps:true})

export const Comment = mongoose.model("Comment",schema) 