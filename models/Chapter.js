import mongoose from 'mongoose'
import { Novel } from './Novel.js'

const schema =new  mongoose.Schema({
    chapternumber:{
        type: Number,
        require: true,
        default:0
    },
    content:{
        type: String,
        require: true,
        default:"Nội dung chương",
        validate:{
            validator:item=>{
                return item.length > 10
            },
            message:"Nội dung phải dài hơn 10 kí tự"
        }
    },
    chaptername:{
        type: String,
        require: true,
    },
    novelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel"
    },
    isLock: {
        type: Boolean,
        default: false
    },
    price: {
        type:Number,
        default:200
    }
},
{timestamps:true}
)
schema.pre('save',async function(next){
    console.log(this)
    await Novel.updateOne({_id:this.dautruyenId},{$inc:{chapternumber:1}})
    next()
})

schema.pre('findOneAndDelete', { query: true, document: false },async function(next){
    let id=this.getQuery()['novelId'];
    await Novel.updateOne({_id:id},{$inc:{chapternumber:-1}})
    next()
})
export const Chapter = mongoose.model('Chapter', schema)