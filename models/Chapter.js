import mongoose from 'mongoose'
import { Novel } from './Novel.js'

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
schema.pre('save',async function(next){
    console.log(this)
    await Novel.updateOne({_id:this.dautruyenId},{$inc:{sochap:1}})
    next()
})

schema.pre('findOneAndDelete', { query: true, document: false },async function(next){
    let id=this.getQuery()['dautruyenId'];
    await Novel.updateOne({_id:id},{$inc:{sochap:-1}})
    next()
})
export const Chapter = mongoose.model('Chapter', schema)