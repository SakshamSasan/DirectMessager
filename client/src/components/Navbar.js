import classes from '../styles/Navbar.module.css';
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../providers/ProvideAuth';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState,useRef, useEffect } from 'react';
import {toast} from 'react-toastify';
import { getItemFromLocalStorage, TokenKey } from "../utils";
import CloseButton from 'react-bootstrap/CloseButton';
function Navbar(){

    const auth = useAuth();
    const navigate = useNavigate();
    const myRef = useRef();
    const [searchText,setSearchText] = useState("")
    const [searchResults,setSearchResults] = useState(null)
    //For React modal
    const [show,setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function addChat(item){
        let url = 'http://localhost:80/access'
        try {
            let response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body:JSON.stringify(item)
            });
            let data = await response.json();
            console.log(data,'$$')
            auth.setChats([...auth.chats,data.data])
            auth.setSelectedChat(data)
            
        }catch(err){
            console.log(err)
            toast.error('Some error in starting new chat')
        }
    }
    const handleRedirect = ()=>{
        setShow(false)
        navigate('/profile')
    }
    const avatar = auth.user ? auth.user.avatar:""
    function Signout(){
        auth.logout();
        navigate('/signin')
    }
    
    const handleSearch = async (e)=>{
        e.preventDefault();
        if(searchText.length<=0){
            setSearchResults(null)
            return toast.warning('Please fill input Box')
        }
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
    const style = {
        navdark:{
            backgroundColor:'rgb(0,0,0)'
       
        },
        brand:{
            fontFamily: "'Inner Vintage', sans-serif",
            color:'white',
            margin:'0 !important',
            fontWeight:'bold',
        },
        person:{
            backgroundImage:`url(${avatar})`,
            backgroundSize:'cover'
        },
        label:{
            color:'black',
            fontWeight:'bolder'
        }
    }
    return(
        <nav className="navbar navbar-expand-lg" style={style.navdark}>
            <div className="container-fluid">
            <div className='navbar-brand d-flex'>
                    <div className={`${classes.w_6} me-3`}>
                        <div className={classes.aspectratio}></div>
                    </div>
                    <div>
                        <div style={style.brand}>Direct</div>
                        <div style={style.brand}>Messager</div>
                    </div>
                    
                    
                </div> 

                {auth.user ?
                <>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className={`navbar-toggler-icon ${classes.icon}`}><i className="fa-solid fa-bars"></i></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav m-auto mb-2 mb-lg-0 w-75">

                            
                            <li className="nav-item my-2 ml-lg-5">
                            <form className="d-flex">
                                <div className='d-inline-block w-input' style={{position:'relative'}}>
                                    <input onChange={(e)=>{setSearchText(e.target.value)}}
                                     style={{height:'2rem !important'}} 
                                     className="form-control me-2 w-100" type="search" 
                                     placeholder="Find User" aria-label="Search"/>
                                    <div className={`w-100 ${searchResults? classes.searchDropdown:classes.searchDropdownInvisible}`}>
                                        <div className='row'>
                                            <div className='col-11 d-flex justify-content-end p-1' style={style.label} >
                                                <CloseButton onClick={()=>setSearchResults(null)} />
                                            </div>
                                        </div>
                                        
                                        {searchResults?<>{searchResults.length>0?searchResults.map((item)=>
                                        <>
                                        
                                        <div className='row searchBarResults' onClick={addChat.bind(null,item)}>
                                                
                                                <div className="col-4">
                                                    <div className={`m-1 my-2 ${classes.searchPic}`} style={{backgroundImage:`url(${item.avatar})`}}></div>
                                                </div>
                                                <div className="col-8 d-flex flex-column justify-content-center">
                                                    <div style={style.label}>{item.name}</div>
                                                </div>
                                        </div>
                                        </>
                                            
                                        ):
                                        <>
                                            <div className='row text-dark'>
                                                <div className=' my-2 col-12 d-flex justify-content-center'>
                                                <i>No users found</i>  
                                                </div>
                                                
                                            </div>
                                        </>}</>
                                        :
                                        <></>
                                        }
                                    </div>
                                </div>
                                
                                <button className="btn btn-outline-success mx-1" onClick={handleSearch} type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                            </form>
                            </li>

                            <li className='nav-item my-3 mb-3 ml-lg-5'>
                                <Link className={`${classes.homelinks}`} to='/'>Home</Link>
                            </li>
                            
                            <li className='nav-item my-2 mb-3 ml-lg-5'>
                                
                                    <button onClick={Signout} type="button" className={`btn btn-outline-danger button ${classes.signout}`}>Sign Out</button>
                                
                            </li>
                            <li className='nav-item mt-1'>
                                
                                    <div onClick={handleShow} className={classes.profilepic} style={style.person}></div>
                                
                            </li>
                        </ul>
                    </div>
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header className='d-flex justify-content-center' >
                        <Modal.Title>{auth.user.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='d-flex flex-column align-items-center justify-content-center'>
                            <div className={`${classes.modalPic} my-3`} style={style.person}>

                            </div>
                            <h4>{auth.user.email}</h4>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-center'>
                        <Button variant="success" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant='danger' onClick={handleRedirect}>
                            Edit Profile
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </> 
                :<></>}
                
                
                
                
            </div>
        </nav>
    )
}

export default Navbar;