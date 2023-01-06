import { useAuth } from "../providers/ProvideAuth";
import UpdateGM from "./UpdateGM";
import { useEffect,useState } from "react";
import ProfileModal from "./ProfileModal";
import classes from '../styles/ChatBox.module.css'
import {toast} from 'react-toastify';
import { getItemFromLocalStorage, TokenKey } from "../utils";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:80';
var socket,selectedChatCompare;

function ChatBox(){
    const {user,setChats,selectedChat,setSelectedChat} = useAuth();
    const [show,setShow] = useState(false)
    //for messages
    var [messages,setMessages] = useState([])
    var [newMessage,setNewMessage] = useState()
    var [loading,setLoading] = useState(false)
    var [socketConnected,setSocketConnected] = useState(false)
    const handleClose = () => {setShow(false);
    } ;
    const handleShow = ()=>{setShow(true);
    } ;
    function goBack(){
        setSelectedChat(null)
    }
    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit('setup',user);
        socket.on('connection',()=>{
            setSocketConnected(true)
        })
    },[])
    useEffect(()=>{
        fetchMessages()

        selectedChatCompare = selectedChat;

    },[selectedChat])

    useEffect(()=>{
        socket.on('message received',(message)=>{
            if(!selectedChatCompare||selectedChatCompare._id!=message.chat._id){
                //give notification
                
            }
            
            else {
                setMessages([...messages,message])
            }
            console.log('message hua receive',message)
            getChats();
        })
    })

    async function getChats(){
        try{
            let url = 'http://localhost:80/chats'
            let response = await fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                }
            })
            let data = await response.json()
            setChats(data.data)

        }catch(error){
            console.log(error)
        }
        
    }
    async function fetchMessages(){
        if(!selectedChat)return;
        setLoading(true)
        try{
            let url = `http://localhost:80/getmessages/${selectedChat._id}`
            let response = await fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                }
            })
            let data = await response.json()
            console.log(data)
            setMessages(data.data)
            setLoading(false)
            socket.emit('join room',selectedChat._id)
        }catch(err){
            console.log(err)
            return toast.error('Error in fetching messages')
        }
    }
    async function sendMessage(){
        if(newMessage.length<=0){
            return toast.warn('Type something for message to be sent')
        }
        try{
            let url = 'http://localhost:80/message'
            let response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify({content:newMessage,chatId:selectedChat._id})
            })
            let data = await response.json()
            console.log(data)
            setNewMessage("")
            socket.emit('new message',data.data)
            //Set Messages mein array mein data bhi jodh do
            setMessages([...messages,data.data])
        }catch(err){
            console.log(err)
            return toast.error('Error in sending messages')
        }
    }

    return(
        <>
        {selectedChat?
        <>
        
        <div className="row border-bottom py-3 px-1 mb-2">

            <div className="col-2 d-flex align-items-center justify-content-start">
                <i style={{cursor:'pointer'}} onClick={goBack} className="fa-solid fa-left-long"></i>
            </div>

            <div className="col-8 d-flex justify-content-center">
                <h4>{selectedChat.chatName!='sender' ?selectedChat.chatName :selectedChat.name}</h4>
            </div>

            <div className="col-2 d-flex align-items-center justify-content-end">
                <i onClick={()=>setShow(true)} 
                className="fa-solid fa-eye"
                style={{cursor:'pointer'}} ></i>
            </div>

        </div>
        <div className="row p-2">
            <div style={{position:'relative',backgroundColor:'rgb(228,218,218)'}} className="col-12 p-1 px-2 rounded vh-65">
                <div className="w-100 h-90">
                    {loading?
                    <div className='d-flex w-100 h-100 justify-content-center align-items-center'><h3>Loading....</h3></div>
                    :
                    <div className={`d-flex w-100 h-100 py-2 px-1 ${classes.scrollMessages}`}>
                        <ScrollableChat messages={messages}/>
                    </div>}
                </div>
                <div className={classes.inputDiv}>
                    <div className={`${classes.div} me-1`}>
                        <input className={`${classes.inputTag} rounded border px-2 `}
                        placeholder="Write a message"
                        onChange={(e)=>setNewMessage(e.target.value)}
                        value={newMessage}>
                        </input>
                    </div>
                    <div className={`${classes.div2} d-flex justify-content-center`}>
                    <i className={`${classes.icon} fa-solid fa-paper-plane`}
                    onClick={sendMessage}></i>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
        {selectedChat.isGroupChat ? <UpdateGM show={show} handleClose={handleClose}/>:<ProfileModal show={show} handleClose={handleClose} />}
        
        </>
        :
        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
            <big><i>Click a chat to start conversation</i></big>
        </div>}

        </>
    )
}
export default ChatBox;