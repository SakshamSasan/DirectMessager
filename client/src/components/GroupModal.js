import { useCallback, useEffect,useState } from "react";
import classes from '../styles/GroupModal.module.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import { toast } from "react-toastify";
import { getItemFromLocalStorage, TokenKey } from "../utils";
import { useAuth } from "../providers/ProvideAuth";

function GroupModal({show,handleClose}){

    var {chats,setChats,setSelectedChat} = useAuth();
    //for group details
    var [groupName,setGroupName] = useState();
    var [selectedUsers,setSelectedUsers] = useState([])
    var [searchText,setSearchText] = useState("")
    var [groupName,setGroupName] = useState("")
    const [searchResults,setSearchResults] = useState(null)
    var [loading,setLoading] = useState(false)
    //For react modals
    
    useEffect(()=>{
        setGroupName("");
        setSearchResults(null);
        setSearchText()
        setSelectedUsers([])
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

    
    function handleGroup(item,add){
        if(add){
            if(selectedUsers.includes(item)){
                toast.warning('User already added')
            }
            else {
                setSelectedUsers([...selectedUsers,item])
            }
        }
        else {
            setSelectedUsers(selectedUsers.filter((i)=>i._id!=item._id))
        }
        
    }
    async function groupCreate(){
        
        if(!groupName||(!selectedUsers.length>=2)){
            toast.error('Please give Group Name and at least 3 users')
            console.log(selectedUsers.length,'l')
            return;
        }
        setLoading(true)
        let url = 'http://localhost:80/group'
        try{
            var response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify({users:selectedUsers,name:groupName})
            })

            var data = await response.json();
            setChats([...chats,data.data])
            setSelectedChat(data.data)

        }catch(err){
            console.log(err)
            toast.error('Some error in creating groups',data.message)
        }
        setLoading(false)
    }
    return(
        <>
        
        <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header className='d-flex justify-content-center' closeButton>
                        <Modal.Title>Create Group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='d-flex flex-column align-items-center justify-content-center'>
                            <div className={`${classes.inputDiv} my-2`}>
                                <input className="w-100 h-100 p-2 rounded border" 
                                placeholder="Group Name" 
                                required
                                onChange={(e)=>setGroupName(e.target.value)}
                                ></input>
                                
                            </div>
                            <div className={`mt-2 ${classes.label_container} d-flex justify-content-start align-items-center p-1`}>
                                {selectedUsers?selectedUsers.map((item)=>
                                <>
                                <div style={style.label_name} className={`${classes.container} rounded text-white px-1 mx-1`}>
                                    {item.name} &nbsp;<i style={{cursor:'pointer'}} onClick={handleGroup.bind(null,item,false)} className="fa-solid fa-xmark"></i>
                                </div>
                                </>):
                                <></>}
                            </div>
                            <div className={`${classes.inputDiv} my-2`}>
                                <input className="w-100 h-100 p-2 rounded border" placeholder="Search Users" onChange={(e)=>{setSearchText(e.target.value)}} required></input>
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
                                                <div onClick={handleGroup.bind(null,item,true)} style={{cursor:'pointer'}} className="col-2 d-flex justify-content-start align-items-center">
                                                    <i>Add</i>
                                                </div>
                                            </div>
                                        </>
                                            
                                        ):
                                        <>
                                            <div className="row text-dark">
                                            <div className=' my-2 col-12 d-flex justify-content-center'>
                                                <i>No users found</i>  
                                                </div>
                                            </div>
                                        </>
                                        }</>:<></>}
                                    </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-center'>
                        <Button variant="success" onClick={groupCreate} disabled={loading}>
                            Create
                        </Button>
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
export default GroupModal;