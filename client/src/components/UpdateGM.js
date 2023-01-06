
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import { useAuth } from '../providers/ProvideAuth';
import classes from '../styles/UpdateGM.module.css'
import { useEffect,useState } from "react";
import { toast } from "react-toastify";
import { getItemFromLocalStorage, TokenKey } from "../utils";

function UpdateGM({show,handleClose}){
    const {user,setChats,selectedChat,setSelectedChat} = useAuth();
    var [groupName,setGroupName] = useState("");
    var [selectedUsers,setSelectedUsers] = useState([])
    var [searchText,setSearchText] = useState("")
    var [searchResults,setSearchResults] = useState(null)
    var [loading,setLoading] = useState(false)
    //For react modals
    useEffect(()=>{
        setSelectedUsers(selectedChat.users.filter((a)=>a.name!=user.name));
    },[])
    useEffect(()=>{
        setGroupName("");
        setSearchResults(null);
        setSearchText()
        // setSelectedUsers([])
    },[show])

    useEffect(()=>{
        async function handleSearch(){
    
            try{
                let response = await fetch(`http://localhost:80/fetch?search=${searchText}`,{
                method:'GET',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                }
                })
                let data = await response.json();
                if(data.success){
                    setSearchResults(data.data)
                }
                else {
                    return toast.error('Some error occurred in fetching users')
                }
            }
            catch(error){
                toast.error('Some error occurred in fetching users')
            }
    
            }
            handleSearch()
        
    },[searchText])
    async function getChats(){
        let url2 = 'http://localhost:80/chats'
            let response2 = await fetch(url2,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                }
            })
            let data2 = await response2.json()
            setChats(data2.data)
    }
    function otherOne(item){
        if(!item.isGroupChat) {
            let other = item.users.filter((a)=>a.name!=user.name)
            let chat = {...item,name:other[0].name,avatar:other[0].avatar}
            return chat
        }
        else {
            let other = {...item,name:item.chatName}
            return other
        }
  
    }
    async function handleRemove(item){
        if(user._id!=selectedChat.groupAdmin._id){
            return toast.error('Only group admins can make changes')
        }
        let url = 'http://localhost:80/groupremove'
        try{
            let response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify({chatId:selectedChat._id,userId:item._id})
            })
            let data = await response.json()
            setSelectedChat(data.data)
            setSelectedUsers(selectedUsers.filter((a)=>a.name!=item.name))
            getChats()
        }catch(err){
            toast.error('Some error in removing user')
        }
    }
    async function handleAdd(item){
        if(user._id!=selectedChat.groupAdmin._id){
            return toast.error('Only group admins can make changes')
        }
        if(selectedUsers.some((a)=>a.name==item.name)){
            return toast.warn('User already in Group')
        }
        let url = 'http://localhost:80/groupadd'
        try{
            let response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify({chatId:selectedChat._id,userId:item._id})
            })
            let data = await response.json()
            setSelectedChat(data.data)
            setSelectedUsers([...selectedUsers,item])
            getChats()
        }catch(err){
            toast.error('Some error in adding user')
        }
    }
    async function handleExit(){
        let url = 'http://localhost:80/groupremove'
        setLoading(true)
        try{
            let response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify({chatId:selectedChat._id,userId:user._id})
            })
            let data = await response.json()
            setSelectedChat(data.data)
            getChats()
            setLoading(false)
            handleClose()
        }catch(err){
            toast.error('Some error in exiting group')
        }
    }

    async function handleRename(){
        let url = 'http://localhost:80/grouprename'
        try{
            let response = await fetch(url,{
                method:'PUT',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify({chatId:selectedChat._id,name:groupName})
            })
            let data = await response.json()
            setSelectedChat(data.data)
            getChats()
            setGroupName("")
        }catch(err){
            toast.error('Some error in renaming group')
        }
    }
    return (
        <>
            <Modal
                show={show}
                aria-labelledby="contained-modal-title-vcenter"
                onHide = {handleClose}
                centered
            >
            <Modal.Header className={`d-flex justify-content-center`} closeButton>
                <Modal.Title>
                {otherOne(selectedChat).name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <input className={`${classes.inputDiv} p-2 me-3 my-2 d-inline rounded border`}
                        placeholder="Group Name" 
                        onChange={(e)=>setGroupName(e.target.value)}
                    ></input>
                    <button onClick={handleRename}
                    disabled={loading} 
                    className='btn btn-danger d-inline'>Update</button> 
                </div>
                <div className={`mt-2 ${classes.label_container} d-flex justify-content-start align-items-center p-1`}>
                    
                    {selectedUsers?selectedUsers.map((item)=>
                        <>
                            <div style={style.label_name} className={`${classes.container} rounded text-white px-1 mx-1`}>
                            {item.name} &nbsp;<i style={{cursor:'pointer'}} onClick={handleRemove.bind(null,item)}  className="fa-solid fa-xmark"></i>
                            </div>
                        </>):
                    <></>}
                </div>
                <div className={`${classes.inputDiv} my-2`}>
                    <input className="w-100 h-100 p-2 d-inline rounded border" placeholder="Add Users" onChange={(e)=>{setSearchText(e.target.value)}} required></input>
                    <div className={`w-100 border p-2 rounded ${searchResults? classes.searchDropdown:classes.searchDropdownInvisible}`}>
                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end px-2' style={style.bold} >
                                <CloseButton onClick={()=>setSearchResults(null)} />
                            </div>
                        </div>
                        {searchResults?<>{searchResults.length>0?searchResults.map((item)=>
                            <>        
                            <div className='row groupSearchBarResults' >
                                <div className="col-2">
                                    <div className={`m-1 my-2 ${classes.searchPic}`} style={{backgroundImage:`url(${item.avatar})`}}></div>
                                </div>
                                <div className="col-8 d-flex flex-column justify-content-center">
                                    <div style={style.bold}>{item.name}</div>
                                </div>
                                <div onClick={handleAdd.bind(null,item)} style={{cursor:'pointer'}} className="col-2 d-flex justify-content-start align-items-center">
                                    <i>Add</i>
                                </div>
                            </div>
                            </>
                                            
                            ):
                            <>
                                <div className="row text-dark">
                                    <div className='my-2 col-12 d-flex justify-content-center'>
                                        <i>No users found</i>  
                                    </div>
                                </div>
                            </>
                            }</>:<></>}
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button onClick={handleExit} variant="warning" disabled={loading}>Leave Group</Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}
const style={
    bold:{
        fontWeight:'bold'
    },
    label_name:{
        fontWeight:'bold',
        fontSize:'0.8rem'
    }
}
export default UpdateGM;