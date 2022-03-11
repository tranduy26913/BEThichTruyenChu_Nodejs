import jwt from "jsonwebtoken";
import { ResponseDetail } from "../services/ResponseJSON.js";
const verifyToken = (req, res, next) => {
        const token = req.headers.authorization;
        console.log(req.headers)
        if (token) {
            const accessToken = token.split(" ")[1];
            console.log(accessToken)
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json(ResponseDetail(403,{message:"Token không hợp lệ"}));
                }
                req.user = user;
                next();
            })          
        } else {
            return res.status(401).json(ResponseDetail(401,{message:"Không có token"}));
        }    
}

const verifyTokenRoleAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(req.headers)
    if (token) {
        const accessToken = token.split(" ")[1];
        console.log(accessToken)
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json(ResponseDetail(403,{message:"Token không hợp lệ"}));
            }
            req.user = user;
            next();
        })          
    } else {
        return res.status(401).json(ResponseDetail(401,{message:"Không có token"}));
    }    
}

export { verifyToken }