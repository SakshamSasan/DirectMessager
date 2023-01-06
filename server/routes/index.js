const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const chatController = require('../controllers/chatController')
const messageController = require('../controllers/messageController')
const passport = require('passport')
//routes for user creation, login and fetching
router.post('/login',userController.login);
router.post('/signup',userController.signup)
router.get('/fetch',passport.authenticate('jwt',{session:false}),userController.fetchUsers)
router.post('/edit',passport.authenticate('jwt',{session:false}),userController.editUser)
//routes for chats and groups
router.get('/chats',passport.authenticate('jwt',{session:false}),chatController.getChats)
router.post('/access',passport.authenticate('jwt',{session:false}),chatController.accessChat)
router.post('/group',passport.authenticate('jwt',{session:false}),chatController.createGroupChat)
router.post('/groupadd',passport.authenticate('jwt',{session:false}),chatController.add)
router.post('/groupremove',passport.authenticate('jwt',{session:false}),chatController.remove)
router.put('/grouprename',passport.authenticate('jwt',{session:false}),chatController.rename)
//routes for messages
router.post('/message',passport.authenticate('jwt',{session:false}),messageController.sendMessage)
router.get('/getmessages/:chatId',passport.authenticate('jwt',{session:false}),messageController.allMessages)
module.exports = router;