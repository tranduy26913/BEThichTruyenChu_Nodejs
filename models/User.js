import  mongoose  from "mongoose";

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

 export const User = mongoose.model('User',schema);