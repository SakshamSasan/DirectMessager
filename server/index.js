const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT||8000;
const db = require('./config/mongoose')
const cors = require('cors');
const passport = require('passport')
const passportBase = require('./config/passport-base');
const passportJWT = require('./config/passport-jwt');
const path = require('path')
db()
//MW setup for cors
app.use(cors())
//Normal POST from fetch
app.use(express.json())
//parser to add body key to requests with HTML Post
app.use(express.urlencoded())
//using passport
app.use(passport.initialize())
//use routes
app.use('/',require('./routes'))

//----DEPLOYMENT-----

if(process.env.NODE_ENV ==="production"){
    
    app.use(express.static(path.join('client/build')));
    app.get("*", (req, res) => {
        let url = path.resolve(__dirname, 'client','build', 'index.html');
        if (!url.startsWith('/')) // since we're on local windows
            url = url.substring(1);
        res.sendFile(url);
      });
      
}

//----DEPLOYMENT------
const server=app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('Server listening fine on port',port)
})
const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    }
})
io.on('connection',(socket)=>{
    console.log('connected to socket.io')
    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join room',(room)=>{
        socket.join(room)
        socket.emit('connected')
    })

    socket.on('new message',(message)=>{
        var chat = message.chat;
        if(!chat.users){
            return console.log('No chat found')
        }
        chat.users.forEach(user=>{
            if(user._id==message.sender._id){
                return;
            }
            socket.in(user._id).emit('message received', message)
        })

    })

    // socket.off('setup',()=>{
    //     console.log('USER DISCONNECTED');
    //     socket.leave(userData._id)
    // })
})