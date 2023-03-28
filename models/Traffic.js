import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    count:{
        type:Number,
        required:true,
        default:0
    },
    countGuest:{
        type:Number,
        required:true,
        default:0
    },
    countUser:{
        type:Number,
        required:true,
        default:0
    },
    description:{
        type:String,
        required:true,
        default:''
    },
    
},{timestamps:true})

export const Traffic = mongoose.model("Traffic",schema) 