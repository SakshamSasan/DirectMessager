const Chat = require("../models/chat")
const Message = require("../models/message")
const User = require("../models/user")

module.exports.sendMessage = async (req,res)=>{
    const {chatId,content} = req.body
    if(!chatId||!content){
        console.log('Not enough data for sending messages')
        return res.json(422,{
            success:false,
            message:'Insufficient data passed to server'
        })
    }
    console.log(req.body)
    var newMessage = {
        sender:req.user._id,
        content,
        chat:chatId
    }
    try{
        let createdMessage = await Message.create(newMessage)
        createdMessage=await createdMessage.populate('sender','name avatar email');
        createdMessage=await createdMessage.populate('chat')
        createdMessage=await User.populate(createdMessage,{
            path:'chat.users',
            select:'name avatar email'
        })
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:createdMessage
        })
        return res.json(200,{
            success:true,
            data:createdMessage,
            message:'Messaged successfully'
        })
    }
    catch(err){
        console.log(err,'^^^^')
        return res.json(500,{
            success:false,
            message:err
        })
    }
    
}

module.exports.allMessages = async (req,res)=>{
    try{

        const messages = await Message.find({chat:req.params.chatId}).populate('sender','name avatar email').populate('chat')
        return res.json(200,{
            success:true,
            data:messages,
            message:'Fetched all messages successfully'
        })
    }catch(err){
        return res.json(500,{
            success:false,
            message:err
        })
    }
}