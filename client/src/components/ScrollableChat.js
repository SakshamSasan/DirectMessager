import ScrollableFeed from 'react-scrollable-feed';
import { useAuth } from '../providers/ProvideAuth';
import classes from '../styles/ScrollableChat.module.css'
function ScrollableChat({messages}){
    //We will use scrollable feed from react-scrollable-feed to 
    //organize chats UI for us
    //Functions will help in knowing who is sender of message,
    //and when is last message. This will help in avatar setup in chat etc
    var {user} = useAuth()
    function isSameSender(messages,m,i,userId){
        //whether concurrent messages are from same sender
        return (
            i<messages.length-1 && (
                (messages[i+1].sender._id !== m.sender._id ||
                messages[i+1].sender._id == undefined) && 
                messages[i].sender._id !==userId
            )
        )
    }
    function isLastMessage(messages,i,userId) {
        return (
            i===messages.length-1 && 
            messages[messages.length-1].sender._id !=userId &&
            messages[messages.length-1].sender._id
        )
    }
    return (
        <ScrollableFeed className='w-100 h-100'>
            {messages&&messages.map((m,i)=>
                <div className='d-flex w-100 my-1'
                style={{
                    justifyContent:`${
                        m.sender._id==user._id?'end':'start'
                        }`}}>
                    {m.sender._id!=user._id?
                    <>
                    {!((isSameSender(messages,m,i,user._id))||
                        isLastMessage(messages,i,user._id))&&(
                            <div className={`me-1  ${classes.avatar}`}>
                                
                            </div>
                        )}
                    </>
                    :
                    <></>
                    }
                    
                  
                    
                    {(isSameSender(messages,m,i,user._id)||
                    isLastMessage(messages,i,user._id))&&(
                        <div className={`${classes.avatar} me-1 `} style={{backgroundImage:`url(${m.sender.avatar})`}}>
                            
                        </div>
                    )}
                    {m.sender._id==user._id ?
                    <span className={`${classes.messageUser} rounded p-2`}>
                        {m.content}
                    </span>
                    :
                    <span className={`${classes.messageSender} rounded p-2`}>
                        {m.content}
                    </span>}
                    
                </div>
            )}
        </ScrollableFeed>
    )
}
export default ScrollableChat