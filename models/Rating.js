import  mongoose  from "mongoose";
import { Novel } from "./Novel.js";
import { Reading } from "./Reading.js";
import { User} from './User.js'
const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    novelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel"
    },
    rating: {
        type:Number,
        require: true,
    },
    content:{
        type:String,
        required:true
    },
},
    {timestamps:true}
);


export const Rating = mongoose.model('Rating', schema)
