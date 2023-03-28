
import express from 'express';
import {AdminController} from '../controllers/AdminController.js';
import { AuthController } from '../controllers/AuthController.js';
import {verifyToken, verifyTokenAdmin} from "../controllers/middlewareController.js"

const router = express.Router();
router.put('/user/active',verifyTokenAdmin,AdminController.activeByAdmin);

router.put('/user/inactive',verifyTokenAdmin,AdminController.inactiveByAdmin);

router.put('/user/inactivebyid',verifyTokenAdmin,AdminController.inactiveWithIdByAdmin);

router.put('/role/updatetouser',verifyTokenAdmin,AdminController.updateRoles)

router.get('/users',verifyTokenAdmin,AuthController.LoadUsers);

router.post('/user/deleteaccount',verifyTokenAdmin,AdminController.deleteAccount)

router.post('/novel/deletenovel',verifyTokenAdmin,AdminController.deleteNovelById)

router.get('/users/getlistusers',verifyTokenAdmin,AdminController.GetListUser)

router.get('/novel/getnovels',verifyTokenAdmin,AdminController.GetNovels)

router.get('/bills/getbills',verifyTokenAdmin,AdminController.GetBills)

router.post('/user/getuserinfo',verifyTokenAdmin,AdminController.GetUserById)

router.post('/user/updatedeleteaccount',AdminController.updateDeleteStatus)

router.get('/comment/getlistcomments',verifyTokenAdmin,AdminController.GetListOfComments)

router.get('/rating/getlistratings',verifyTokenAdmin,AdminController.GetListRating)

router.get('/rating/deleterating',verifyTokenAdmin,AdminController.DeleteRating)

router.get('/comment/deletecomment',verifyTokenAdmin,AdminController.DeleteComment)

router.get('/novel/getnovelreview',verifyTokenAdmin,AdminController.GetNovelCommentRatings)

router.post('/novel/getnovelreviewbyid',verifyTokenAdmin,AdminController.GetNovelReviewById)

router.post('/novel/getnovelreviewbyurl',verifyTokenAdmin,AdminController.GetNovelReviewByUrl)
export default router