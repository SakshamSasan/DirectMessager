import classes from '../styles/Login.module.css'
import {useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {useAuth} from '../providers/ProvideAuth'
import {toast} from 'react-toastify';
function Login(){

    let [email,setEmail] = useState(null)
    let [password,setpwd] = useState(null)
    let [name,setName] = useState("")
    let [logging,setLogging] = useState(false)
    let navigate = useNavigate()
    let auth = useAuth();

    if(auth.user){
        navigate('/')
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        setLogging(true)
        if(!email||!password||!name){
            setLogging(false);
            return toast.error('Please fill all fields')
        }
        let res = await auth.signup({email,password,name})
        if(res.success){
            toast.success('Signed Up successfully')
            navigate('/')
        }
        else{
            toast.error(res.message)
            setLogging(false)
        }
    }

    return(
        <div className={`container-fluid d-flex justify-content-center`}>
            <div className='row my-5 d-flex justify-content-center'>
                <div className='col-12 bg-white rounded col-md-8'>
                    <div className='row'>
                    <div className='col-12 my-3 me-3 ml-3'>
                    <h2 style={style.center}>Sign up to get started</h2>
                </div>
                <div className='col-12 mt-5 mb-2'>
                    <form className='w-100 row d-flex flex-column align-items-center' action="" method="POST">
                            <div className="col col-md-7 col-lg-8 my-3 d-flex flex-column align-items-stretch ">

                                <label className='w-100' style={style.label}>Name <sup style={{color:'red'}}>*</sup>
                                <input type='name' onChange={(e)=>setName(e.target.value)} className='w-100 border py-2 px-2 rounded border-dark' id="name" name="name" required placeholder="Raj"/>
                                </label>

                            </div>
                            <div className="col col-md-7 col-lg-8 my-3 d-flex flex-column align-items-stretch ">

                                <label className='w-100' style={style.label}>Email <sup style={{color:'red'}}>*</sup>
                                <input type='email' onChange={(e)=>setEmail(e.target.value)} className='w-100 border py-2 px-2 rounded border-dark' id="email" name="email" required placeholder="abc@example.com"/>
                                </label>
                                
                            </div>
                            
                            <div className="col col-md-7 col-lg-8 my-3 d-flex flex-column align-items-stretch ">

                                <label className='w-adjust' style={style.label}>Password <sup style={{color:'red'}}>*</sup>
                                <input onChange={(e)=>setpwd(e.target.value)} type='password' className='w-100 border py-2 px-2 rounded border-dark' id="pwd" name="password" required/>
                                </label>
                                
                            </div>
                            <div className='col col-md-7 col-lg-8 d-flex justify-content-center' >
                                <button onClick={handleSubmit} disabled={logging} type="submit" style={style.button} className={`w-100 bg-danger rounded my-3 m-auto ${classes.googlepill}`}>
                                {logging?'Signing Up...':"Sign Up"}
                                </button>
                            </div>
                            
                        </form>
                </div>
                
                <div className='col mb-5 d-flex justify-content-center'>
                    <div className="my-1 d-flex justify-content-center align-items-center" style={style.align}>
                        <Link to='/signin'>Already a user ? Click to Log In</Link>
                    </div>

                </div>
                    </div>
                </div>
                
            
            </div>
        </div>
        
    )
}
const style={
    center:{
        textAlign:'center'
    },
    label:{
        fontWeight:'bolder'
    },
    button:{
        color:'white'
    },
    align:{
        fontWeight:'bolder',
        overflowWrap:'break-word',
        textAlign:'center'
    }
}
export default Login;