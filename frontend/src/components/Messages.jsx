import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
// import store from "@/redux/Store";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const {messages}=useSelector(store=>store.chat)
  const {user}=useSelector(store=>store.auth)
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" className="h-8 w-8 rounded-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {
        messages&&  messages.map((msg)=>{
                return(
                  <div
                  key={selectedUser?._id}
                  className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId===user?._id ?"bg-blue-500 text-white":"bg-gray-200 text-black"}`}>
                    {msg.message}
                  </div>
                </div>
                
                )
            })
        }
      </div>
    </div>
  );
};

export default Messages;
