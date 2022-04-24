import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { ResponseData, ResponseDetail } from "../services/ResponseJSON.js";
import { Role } from "../models/Role.js";
import { sendMail } from "../services/EmailService.js";
import mongoose from "mongoose";
import generator from "generate-password"

export const AdminController = {

    activeByAdmin: async (req, res) => {
       try {
           const username = req.body.username;
           const updateUser = await User.findOneAndUpdate({ username: username }, { active: true }, { new: true }).populate('roles')
   
           if (updateUser)
               return res.status(200).json(ResponseData(200, updateUser))
           return res.status(400).json(ResponseDetail(400, {message:"Kích hoạt thất bại"}))
       }
       catch (error) {
           console.log(error)
           return res.status(500).json(ResponseDetail(500, { message: "Lỗi cập nhật quyền tài khoản" }))
       }
   },
   inactiveByAdmin: async (req, res) => {
       try {
           const username = req.body.username;
           const updateUser = await User.findOneAndUpdate({ username:username }, { active: false }, { new: true }).populate('roles')
           if (updateUser)
               return res.status(200).json(ResponseData(200, updateUser))
           return res.status(400).json(ResponseDetail(400,  {message:"Khoá thất bại"}))
       }
       catch (error) {
           console.log(error)
           return res.status(500).json(ResponseDetail(500, { message: "Lỗi cập nhật quyền tài khoản" }))
       }
   },
   updateRoles:async(req,res)=>{
    try{
        const rolesRequest = req.body.roles;
        const username = req.body.username;
        let roles=[]
        const getRoles =async(list)=>{
            const roles=[]
            for(let i=0;i<list.length;i++){
                let role = await Role.findOne({name:list[i]})
            roles.push(role)
            }
            return roles
        }
        roles = await getRoles(rolesRequest)
        if(username){
            const newUser=await User.updateOne({username},{roles:roles.map(item=>item.id)},{new:true})
            if(newUser){
                return res.status(200).json(ResponseData(200,{message:"Cập nhật quyền thành công"}))
            }
            else
                return res.status(400).json(ResponseDetail(400,{message:"Cập nhật không thành công"}))
        }else
            return res.status(400).json(ResponseDetail(400,{message:"Không có username"}))
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(ResponseDetail(500,{message:"Lỗi cập nhật quyền tài khoản"}))
    }
},
} 