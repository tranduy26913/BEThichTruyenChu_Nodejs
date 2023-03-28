import mongoose from 'mongoose'

const schema =new  mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    chapterId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Chapter"
    }
},
{timestamps:true}
)

export const Chapterunlocked = mongoose.model('Chapterunlocked', schema)