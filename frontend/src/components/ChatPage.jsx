import { setSelectedUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { useEffect, useState } from "react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";


const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const {onlineUsers,messages}=useSelector(store=>store.chat)

  const dispatch = useDispatch();
  const[textMessage,setTextMessage]=useState("")

  const sendMessageHandler = async (recieverId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/message/send/${recieverId}`, // Fixed URL
        {textMessage }, // Payload
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Correctly placed
        }
      );
      if(res.data.success){
        dispatch(setMessages([...messages,res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log("Error sending message:", error.message); // Log the error
    }
  };
  useEffect(()=>{
    return()=>{
        dispatch(setSelectedUser(null));
    }
  },[])
  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8 ">
        <h1 className="font-bold text-xl mb-4 px-3">{user?.username}</h1>
        <hr className="mb-3 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline=onlineUsers.includes(suggestedUser?._id)
            return (
              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14 rounded-full">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full ">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" className="h-8 w-8 rounded-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
         <Messages selectedUser={selectedUser}/>
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages"
              value={textMessage}
              onChange={(e)=>setTextMessage(e.target.value)}
            />
            <Button onClick={()=>sendMessageHandler(selectedUser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1>Your messages</h1>
          <span>send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
