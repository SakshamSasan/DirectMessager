import {useAuth} from '../providers/ProvideAuth';
import classes from '../styles/UserProfile.module.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import FileInput from './FileInput';
import {toast} from 'react-toastify';
function UserProfile(){
    var auth = useAuth();
    let [editInfo,setEditInfo] = useState(false);
    let [updating,setUpdating] = useState(false);
    const [data, setData] = useState({
		name: auth.user?auth.user.name:'anonymous',
		img: "",
        password:""
	});
    const navigate = useNavigate();
    if(!auth.user){
        navigate('/signin')
    }
    const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleInputState = (name, value) => {
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdating(true)
        if(!data.name){
            toast.warning('Please fill in at least name');
            setUpdating(false)
            return;
        }
		
		let reply = await auth.setAvatar(data);
        if(!reply.success){
            toast.error('An error occured in updating user')
        }
        toast.success('Successfully updated the user')
        setUpdating(false)
	};
    
    function showForm(){
        setEditInfo(true)
    }


    var avatar = auth.user ? auth.user.avatar : "";
    const style={
        center:{
            textAlign:'center'
        },
        person: {
            backgroundImage: `url(${avatar})`
        },
        content:{
            textAlign:'center',
            fontWeight:'bold',
            color:'black',
            fontFamily: "'Inner Vintage', sans-serif",
        },
        label:{
            display:'inline-block',
            textAlign:'left',
            color:'black',
            fontWeight:'bold',
            fontSize:'1.2rem',
            fontFamily: "'Inner Vintage', sans-serif",
        }
    }
    return (
        <div className={`container-fluid d-flex justify-content-center`}>
            <div className='row my-5 d-flex justify-content-center'>
                <div className='col-12 bg-white rounded'>
                    <div className='row'>
                        <div className='col-12 my-3 me-5 ml-5'>
                            <h2 style={style.center}>User Profile</h2>
                        </div>
                        <div className='col-12 mt-3 mb-2 d-flex justify-content-center'>
                            <div className={`${classes.profilepic}`} style={style.person}>

                            </div>
                        </div>
                        {editInfo?
                        <form className='my-5 px-5 m-auto d-flex flex-column align-items-center' method={``} action='POST' encType="multipart/form-data">
                        <label for='name' className="w-80 w-50-md" style={style.label}>Name <sup style={{color:'red'}}>*</sup></label>
                        <input onChange={handleChange} id='name' className="d-block mb-5 m-auto w-80 w-50-md rounded p-2 user-input" type="text" name="name" value={data.name}>
                                
                        </input>
    
               
                        <label for='password' className="w-80 w-50-md" style={style.label}>Password</label>
                        <input onChange={handleChange} id='password' className="d-block mb-5 m-auto w-80 w-50-md rounded p-2 user-input" type="password" name="password" required value={data.password}>
                        </input>

                        <label for='avatar' className="w-80 w-50-md" style={style.label}>Avatar</label>
                        <FileInput 
                            name="img"
                            label="Choose Image"
                            handleInputState={handleInputState}
                            type="image"
                            value={data.img}
                            accept="image/*"
                        />
                        <button disabled={updating} onClick={handleSubmit} className={`${classes.button} py-2 px-4 bg-success mt-5 d-block m-auto rounded-pill`}>
                            {updating?'Updating...':'Submit'}
                        </button>
                        <button disabled={updating} onClick={()=>{setEditInfo(false)}}  className={`${classes.button} py-2 px-4 bg-danger mt-3 d-block m-auto rounded-pill`}>
                                Cancel 
                        </button>
                    </form>:
                    <div className='my-5 px-5'>
                    <h3 className="mb-5" style={style.content}>
                            Name : &emsp;{auth.user.name}
                    </h3>
                    <h3 style={style.content}>
                            Email : &emsp;{auth.user.email}
                    </h3>
                    <button onClick={showForm} className={`${classes.button} py-2 px-4 bg-success mt-5 d-block m-auto rounded-pill`}>
                            Edit info 
                    </button>
                    </div>
                }
                    </div>

                </div>
            </div>
        </div>
    )
}
export default UserProfile;