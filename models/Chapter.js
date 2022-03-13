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
schema.pre('save',next=>{
    Novel.updateOne({_id:this.dautruyenId},{$inc:{sochap:1}})
    next()
})

schema.pre('deleteOne', { query: true, document: false },next=>{
    let id=this.getQuery()['_id'];
    Novel.updateOne({_id:this.dautruyenId},{$inc:{sochap:-1}})
    next()
})
export const Chapter = mongoose.model('Chapter', schema)