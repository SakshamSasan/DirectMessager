import { AuthContext } from "./AuthProvider";
import { useContext, useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';
import { deleteItemFromLocalStorage, getItemFromLocalStorage, setItemInLocalStorage, TokenKey } from "../utils";



export function useAuth(){
    return useContext(AuthContext)
}
export function useProvideAuth(){

    var [user,setUser] = useState({});
    //We can directly put these states and set handlers
    //in context. These ones below are for chats
    var [chats,setChats] = useState([])
    var [selectedChat,setSelectedChat] = useState()

    useEffect(()=>{
        const token = getItemFromLocalStorage(TokenKey);
        if(token){
            setUser(jwt_decode(token))
        }
    },[])
    
    const login = async(data)=>{
        
        let url =  "http://localhost:80/login"
        
        try{
            let res = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            let token = await res.json();
            if(token.success){
                setItemInLocalStorage(TokenKey,token.data)
                var user_details = jwt_decode(token.data)
                setUser(user_details)
                return {success:true}
            }
            else{
                return {success:false,message:token.message}
            }
            
        }catch(err){
            console.log('!!Error',err)
            return {sucess:false,message:`${err}`}
        }
        
    };
   
    const signup = async (data)=>{
        let url = "http://localhost:80/signup"
        
        try{
            let res = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            let token = await res.json();
            if(token.success){
                setItemInLocalStorage(TokenKey,token.data)
                const user_details = jwt_decode(token.data)
                setUser(user_details)
                return {success:true}
            }
            else{
                return {success:false,message:token.message}
            }
            
        }catch(err){
            console.log('!!Error',err)
            return {success:false,message:err}
        }
    };

    const logout = async()=>{
        

        try{

            //Since JWT is sessionless authentication, calling server is useless
            
            deleteItemFromLocalStorage(TokenKey)
            
            setUser(null)
            
   
        }catch(err){
            console.log('!!Error in signing out',err)
        }

        
        
    };


    //to set Avatar and rest of form data
    const setAvatar = async (data)=>{
        let url = "http://localhost:80/edit"
        try{
            let reply = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${getItemFromLocalStorage(TokenKey)}`
                },
                body: JSON.stringify(data)
            })
            let token = await reply.json()
            if(token.success){
                setItemInLocalStorage(TokenKey,token.data)
                const user_details = jwt_decode(token.data)
                setUser(user_details)
                return {success:true}
            }
            else{
                return {success:false,message:token.message}
            }
        }catch(err){
            console.log('Error in updating user profile',err)
            return {sucess:false,message:err}
        }
    }

    return ({
        user,
        login,
        signup,
        logout,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        setAvatar
    })
}
