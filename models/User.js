import  mongoose  from "mongoose";
import {Comment} from './Comment.js';
import { Novel } from "./Novel.js";
import { Reading } from "./Reading.js";
const schema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique:true,
        validate:{
            validator:item=>{
                return item.length >= 6
            },
            message:"Tên đăng nhập phải dài hơn 5 kí tự"
        }
    },
    password: {
        type:String,
        require: true,
        validate:{
            validator:item=>{
                return item.length >= 8
            },
            message:"Mật khẩu phải dài hơn 8 kí tự"
        }
    },
    email: {
        type: String,
        require: true,
        default: "Anonymous",
        validate:{
            validator:item=>{
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(item)
            },
            message:"Email không hợp lệ"
        }
    },
    roles:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ],
    nickname:{
        type: String,
        require: true,
        default: "Anonymous"
    },
    image:{
        type:String,
        default:"https://1.bp.blogspot.com/-CV8fOXMMw60/YZ-UJ4X9sAI/AAAAAAAACMc/2Svet97exjgNdJ9CeTKUU3OuA-mnCQEzwCLcBGAsYHQ/s595/3a.jpg"
    },
    active:{
        type:Boolean,
        require: true,
        default:false
    },
    birthdate:{
        type:Date,
        required:true,
    },
    balance: {
        type:Number,
        default:0,
        require: true
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
},
    {timestamps:true}
 );

 schema.pre('deleteOne', { query: true, document: false },async function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    let id = this.getQuery()['_id'];
    await Comment.deleteMany({userId: id})
    await Reading.deleteMany({userId: id})
    await Novel.deleteMany({uploader: id})
    await Rating.deleteMany({userId: id});
    next();
});

 export const User = mongoose.model('User',schema);