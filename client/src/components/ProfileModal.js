import { useAuth } from "../providers/ProvideAuth"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import classes from '../styles/ProfileModal.module.css'

function ProfileModal({show,handleClose}){
    var {user,selectedChat} = useAuth();

    function otherOne(item){
        if(!item.isGroupChat) {
            let other = item.users.filter((a)=>a.name!=user.name)
            return other[0]
        }
        else {
            let other = {...item,name:item.chatName}
            return other
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
            <Modal.Body className="d-flex flex-column align-items-center">
                <div style={{backgroundImage:`url(${otherOne(selectedChat).avatar})`}} className={`${classes.profilePic}`}></div>
                <div style={{fontWeight:'bold'}} className="my-2">{otherOne(selectedChat).email}</div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button  variant="danger" onClick={handleClose}>Close</Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}
export default ProfileModal;