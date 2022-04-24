import mongoose from "mongoose";

const scheme = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    novel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel",
        required:true
    }
})

export const Saved = mongoose.model("Saved",scheme)