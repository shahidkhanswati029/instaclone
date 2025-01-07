import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef=useRef();
  const [loading,setLoading]=useState(false);
  const [input,setInput]=useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  })
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const fileChangeHandler=(e)=>{
  const file=e.target.files?.[0];
  if(file){
    setInput({...input,profilePhoto:file})
  }
  }
  const selectChangeHandler = (e) => {
    setInput((prevInput) => ({ ...prevInput, gender: e.target.value }));
  };
  
  
  
  
  const editProfileHandler= async()=>{
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePicture", input.profilePhoto); // Use 'profilePicture' to match the backend
    }
    
   try {
    console.log(input)
    setLoading(true);
    const res=await axios.post("http://localhost:4000/api/v1/user/profile/edit",formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      },
      withCredentials:true
    })
    if(res.data.success){
      const updatedUserData={
        ...user,
        bio:res.data.user?.bio,
        profilePicture:res.data.user?.profilePicture,
        gender:res.data.user?.gender
      }
      dispatch(setAuthUser(updatedUserData))
      navigate(`/profile/${user?._id}`)
      toast.success(res.data.message)
    }
    } catch (error) {
    console.log(error)
    toast.error(error.message)
  }finally{
    setLoading(false)
   }
    
  }
  return (
    <div className="flex max-w-2xl mx-auto pl-10 py-8">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl">Edit profile</h1>
        <div className=" flex  items-center justify-between bg-gray-100 rounded-xl ">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="avatar_image" className="h-16 w-16 rounded-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "bio here"}
              </span>
            </div>
          </div>
          <input type="file" className="hidden" ref={imageRef} onChange={fileChangeHandler} />
          <Button onClick={()=>imageRef.current.click()} className="bg-[#0095F6] h-8 hover:bg-[#3283b9]">Change photo</Button>
        </div>
        <div>
            <h1 className="font-bold text-xl mb-2">Bio</h1>
            <textarea className=" w-full focus-visible:ring-transparent outline" name="bio" value={input.bio}
            onChange={(e)=>setInput({...input,bio:e.target.value})}></textarea>
        </div>
        <div >
          <h1 className="font-bold mb-2">Gender</h1>
          <select name="" id="" className="w-full" value={input.gender} onChange={selectChangeHandler}>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>


        </div>
        {
          loading?(
            <Button className="my-10">
               <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
           please wait
            </Button>
          ):(
           <Button className="my-10" onClick={editProfileHandler}>Submit</Button>
          )
        }
        
      </section>
    </div>
  );
};

export default EditProfile;
