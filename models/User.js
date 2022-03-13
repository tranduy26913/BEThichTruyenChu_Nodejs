import  mongoose  from "mongoose";
import {Comment} from './Comment.js';
import { Reading } from "./Reading.js";
const schema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique:true
    },
    password: {
        type:String,
        require: true
    },
    email: {
        type: String,
        require: true,
        default: "Anonymous"
    },
    roles:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ],
    tenhienthi:{
        type: String,
        require: true,
        default: "Anonymous"
    },
    image:{
        type:String,

    },
    active:{
        type:Boolean,
        require: true,
        default:true
    }
},
    {timestamps:true}
 );

 schema.pre('deleteOne', { query: true, document: false },function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    let id=this.getQuery()['_id'];
    Comment.deleteMany({userId: id}).exec();
    Reading.deleteMany({userId:id}).exec();
    next();
});

 export const User = mongoose.model('User',schema);