import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPosts, setselectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
 const {likeNotification}=useSelector(store=>store.realTimeNotification)
  const [open, setOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      navigate("/login");
      dispatch(setAuthUser(null));
      dispatch(setselectedPost(null))
      dispatch(setPosts([]))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sideBarHandler = (textType) => {
    if (textType === "logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    }
    else if(textType==="Profile"){
      navigate(`/profile/${user?._id}`)
    }
    else if(textType==="Home"){
      navigate("/")
    }
    else if (textType==="Message"){
      navigate("/chat")
    }
  };
  const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage
            src={user?.profilePicture}
            className="h-6 w-6 rounded-lg"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "logout" },
  ];
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="font-bold ml-8 my-6">LOGO</h1>
        {sideBarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => sideBarHandler(item.text)}
            className="flex items-center gap-2 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3"
          >
            {item.icon}
            <span>{item.text}</span>
            {
              item.text==="Notifications" &&likeNotification.length>0 &&(
                <Popover>
                  <PopoverTrigger asChild>
                  <Button size="icon" className="rounded-full h-5 w-5 absolute bottom-6 left-6">{likeNotification.length}</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {
                        likeNotification.length===0?(<p>no New notification</p>):(
                          likeNotification.map((notification)=>{
                            return(
                              <div key={notification.userId}>
                                <Avatar>
                                  <AvatarImage src={notification.userDetails?.profilePicture}/>
                                </Avatar>
                                <p className="text-sm"><span className="font-bold">{notification.userDetails?.username}</span> liked your post</p>
                                </div>
                            )

                          })
                        )
                      }
                    </div>
                  </PopoverContent>
                </Popover>
              )
            }
          </div>

        ))}
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSidebar;
