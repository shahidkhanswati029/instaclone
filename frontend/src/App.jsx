
import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Signup from './components/ui/Signup'
import Mainlayout from './components/Mainlayout'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { io, } from 'socket.io-client'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'


const browserRouter=createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><Mainlayout/></ProtectedRoutes>,
    children:[
      {
        path:"/",
        element:<ProtectedRoutes><Home/></ProtectedRoutes>
      },
      {
        path:"/profile/:id",
        element:<ProtectedRoutes><Profile/></ProtectedRoutes>
      },
      {
        path:"/account/edit",
        element:<ProtectedRoutes><EditProfile/></ProtectedRoutes>
      },
      {
        path:"/chat",
        element:<ProtectedRoutes><ChatPage/></ProtectedRoutes>
      },

    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }
])
function App() {
 const {user}=useSelector(store=>store.auth)
 const dispatch=useDispatch()
 useEffect(() => {
  let socketio; // Declare socketio outside the block for cleanup access

  if (user) {
    socketio = io("http://localhost:4000", {
      query: {
        userId: user._id,
      },
      transports: ["websocket"], // Ensure this is a string array
    });
    dispatch(setSocket(socketio));

    // Listen to all the events
    socketio.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on("notification",(notification)=>{
      dispatch(setLikeNotification(notification))
    })

    // Cleanup when the component unmounts or user changes
    return () => {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    };
  }

  // If no user, make sure to reset the socket state
  return () => {
    if (socketio) {
      socketio.close();
      dispatch(setSocket(null));
    }
  };
}, [user, dispatch]);

  
 

  return (
    <>
    
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
