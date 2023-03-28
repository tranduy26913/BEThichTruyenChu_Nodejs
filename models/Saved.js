import mongoose from "mongoose";

const scheme = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    novelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel",
        required:true
    }
})

export const Saved = mongoose.model("Saved",scheme)