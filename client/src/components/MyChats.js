
import { useEffect,useState } from "react";
import { useAuth } from "../providers/ProvideAuth";
import { getItemFromLocalStorage, TokenKey } from "../utils";
import classes from '../styles/MyChats.module.css';
import GroupModal from "./GroupModal";
import { toast } from "react-toastify";
function MyChat(){

    
    var {user,chats,setChats,selectedChat,setSelectedChat} = useAuth()
    const [show,setShow] = useState(false)
    const handleClose = () => {setShow(false);
    } ;
    const handleShow = ()=>{setShow(true);
    } ;
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
    useEffect(()=>{
            getChats()
    },[])
    
    function otherOne(item){

        if(!item.isGroupChat) {
            let other = item.users.filter((a)=>a.name!=user.name)
            let chat = {...item,name:other[0].name,avatar:other[0].avatar}
            return chat
        }
        else {
            let other = {...item,name:item.chatName,avatar:'https://us.123rf.com/450wm/keviz/keviz1802/keviz180200567/96530338-teamwork-people-working-together-icon-vector.jpg?ver=6'}
            return other
        }
  
    }
    return (
        <>
        
        <div className="row border-bottom">
            <div className="col-6 p-3 d-flex justify-content-start">
                <h4>My Chats</h4>
            </div>
            <div className="col-6 p-2" onClick={handleShow}>
                <h4 className="rounded d-flex justify-content-center p-2" style={style.groupIcon}>+ &nbsp; Group Chat</h4>
            </div>
     
        </div>
        <div className={`row ${classes.list_container}`}>
            {chats.length>0 ? 
            chats.map((item)=>
            <>
                <div style={{cursor:'pointer'}} className="col-12 my-3" onClick={()=>setSelectedChat(otherOne(item))}>
                    <div className="row">
                        <div className="col-2">
                            <div className={`${classes.profilePic}`} style={{backgroundImage:`url(${otherOne(item).avatar})`}}>

                            </div>
                        </div>
                        <div className=" offset-1 col-9 d-flex flex-column justify-content-between pb-3 border-bottom">
                            <div style={{fontWeight:'bold'}}>       
                                {otherOne(item).name}
                            </div>
                            <div style={{overflow:'hidden',maxHeight:'1.5rem'}}>
                                <i>{item.latestMessage ? item.latestMessage.content:'Start Chatting...'}</i>
                            </div>
                        </div>
                    </div>
                </div>
            </>)
            :
            <div className="col-12 my-3 d-flex justify-content-center">
                <i>No chats for now. Text someone!!</i>
            </div>}
        </div>
        <GroupModal show={show} handleClose={handleClose}/>
        </>
    )
}


const style={
    bold:{
        fontWeight:'bold'
    },
    label:{
        fontWeight:'bold',
        backgroundColor:'rgba(110,117,124,0.3)'
    },
    groupIcon:{
        fontWeight:'bold',
        backgroundColor:'rgba(110,117,124,0.3)',
        cursor:'pointer'
    }
}
export default MyChat;