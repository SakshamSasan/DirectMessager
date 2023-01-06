import NavBar from "./components/Navbar";
import {Routes,Route} from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { getItemFromLocalStorage } from "./utils";
import { TokenKey } from "./utils";
import {ToastContainer} from 'react-toastify'
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./components/UserProfile";
function PrivateRoute({children,...rest}){
  
  const item = getItemFromLocalStorage(TokenKey)
  return item ? children : <Navigate to="/signin" replace/>;

}

function Page404(){
  return(
    <div className='mt-5 d-flex justify-content-center'>
      <h1>Page not found !!</h1>
    </div>
  )
}
function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path='/' element={<PrivateRoute><Home /></PrivateRoute>}>

        </Route>
        <Route exact path='/profile' element={<PrivateRoute><UserProfile /></PrivateRoute>}>

        </Route>
        <Route exact path='/signin' element={<Login></Login>}>
          
        </Route>
        <Route exact path='/signup' element={<Signup></Signup>}>
          
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
