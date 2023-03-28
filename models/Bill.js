import mongoose from 'mongoose'

const schema =new  mongoose.Schema({
    orderId: {
        type: String,
        require: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User',
    },
    amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'Chưa thanh toán'
    },
    description:{
        type:String,
        require:true,
        default:""
    },
    method:{
        type: String,
        require:true,
    },
    transactionId:{
        type: String,
        default:"",
    }
},
{timestamps:true}
)
export const Bill = mongoose.model('Bill', schema)