import MyChat from "./MyChats";
import ChatBox from "./Chatbox";
import { useAuth } from "../providers/ProvideAuth";

function Home(){
    const {selectedChat,setSelectedChat} = useAuth();
    return(
        <>
        <div className="container-fluid mt-5">
            <div className="row d-flex justify-content-center">

                {selectedChat?
                <>
                <div className="col-12 my-2 col-lg-4 d-none d-lg-inline-block rounded bg-white me-lg-4">
                    <MyChat />
                </div>

                <div  className="col-12 my-2 col-lg-7 rounded bg-white">
                    <ChatBox />
                </div>
                </>:
                <>
                    <div className="col-12 my-2 col-lg-4 rounded bg-white me-lg-4">
                    <MyChat />
                </div>

                <div  className="col-12 my-2 col-lg-7 d-none d-lg-inline-block rounded bg-white">
                    <ChatBox />
                </div>
                </>
                }
                
            </div>

        </div>
        </>
    )
}
export default Home;