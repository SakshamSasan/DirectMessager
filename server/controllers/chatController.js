const Chat = require('../models/chat')
const User = require('../models/user')

module.exports.getChats = async(req,res)=>{
    try{
        let chats = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin','-password')
        .populate({
            path:'latestMessage',
            populate:{
                path:'sender'
            }
        })
        if(chats){

            return res.json(200,{
                data:chats,
                success:true
            })
        }
    }catch(err){
        console.log('**Error',err)
        return res.json(500,{
            success:false
        })
    }
}

module.exports.accessChat = async (req,res)=>{
    //userId of the person we wanna chat with, sent in req
    let userId = req.body._id

    if(!userId){
        console.log('User Id of user desired to chat with not sent in request')
        return res.json(422,{
            message:'Tell user needed to chat with please',
            success:false
        })
    }
    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate('users','-password')
    .populate({
        path:'latestMessage',
        populate:{
            path:'sender',
            select:'name email avatar'
        }
    })
    //if chat exists, send. Else, create one
    if(isChat.length>0){
        return res.json(200,{
            data:isChat[0],
            success:true,
            message:'Chat found'
        })
    }
    else{
        try{
            let newChat = await Chat.create({
                chatName:'sender',
                isGroupChat:false,
                users:[req.user._id,userId]
            })
            await newChat.populate('users','-password')
            return res.json(200,{
                data:newChat,
                sucess:true,
                message:'New Chat created successfully'
            })
            
        }catch(err){
            console.log('**Error',err)
            return res.json(500,{
                success:false,
                message:'Some error in creating new chat'
            })
        }
    }
}

module.exports.createGroupChat = async(req,res)=>{
    //get chatname and all users
    // Parsing array
    let users = req.body.users
    if(users.length<2){
        return res.json(422,{
            success:false,
            message:"Can't create group chat with less than 3 users"
        })
    }
    //add logged in user too
    users.push(req.user)
    
    try{
        let trialChat = await Chat.find({isGroupChat:true,chatName:req.body.name})
        if(trialChat.length>0){
            return res.json(422,{
                success:false,
                message:"Name can't be same"
            })
        }
        let groupChat = await Chat.create({
            isGroupChat:true,
            chatName:req.body.name,
            users,
            groupAdmin:req.user
        })
        await groupChat.populate('users','-password')
        await groupChat.populate('groupAdmin','-password')

        return res.json(200,{
            success:true,
            data:groupChat,
            message:'Group created successfully'
        })
    }catch(err){
        console.log('**Error',err)
        return res.json(500,{
            success:false,
            message:'Some error in creating group chat'
        })
    }
}

module.exports.add = async(req,res)=>{

    let {chatId, userId} = req.body;
    try{
        
        let addedGroup = await Chat.findByIdAndUpdate(
            chatId,
            {$push:{users:userId}},
            {new:true}
        )
        await addedGroup.populate('users','-password')
        await addedGroup.populate('groupAdmin','-password')

        return res.json(200,{
            success:true,
            data:addedGroup,
            message:'Added to group successfully'
        })
    }catch(err){
        console.log('**Error',err);
        return res.json(500,{
            success:false,
            message:'Some error in adding user to group'
        })
    }
}

//remove is a put req. Let's see if it works
module.exports.remove = async(req,res)=>{
    let {chatId, userId} = req.body;
    try{
        
        let removedFromGroup = await Chat.findByIdAndUpdate(
            chatId,
            {$pull:{users:userId}},
            {new:true}
        )
        await removedFromGroup.populate('users','-password')
        await removedFromGroup.populate('groupAdmin','-password')

        return res.json(200,{
            success:true,
            data:removedFromGroup,
            message:'Removed from group successfully'
        })
    }catch(err){
        console.log('**Error',err);
        return res.json(500,{
            success:false,
            message:'Some error in removing user from group'
        })
    }
}

module.exports.rename = async (req,res)=>{
    let {chatId,name} = req.body
    try{
        
        let renameGroup = await Chat.findById(chatId)
        renameGroup.chatName = name;
        renameGroup.save()
        await renameGroup.populate('users','-password')
        await renameGroup.populate('groupAdmin','-password')

        return res.json(200,{
            success:true,
            data:renameGroup,
            message:'Removed from group successfully'
        })
    }catch(err){
        console.log('**Error',err);
        return res.json(500,{
            success:false,
            message:'Some error in removing user from group'
        })
    }
}