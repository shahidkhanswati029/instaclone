import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";


const CreatePost = ({open,setOpen}) => {
    const imageRef=useRef();
    const [file,setFile]=useState("");
    const [caption,setCaption]=useState("")
    const [imagePreview,setImagePreview]=useState("")
    const [louding,setLouding]=useState(false)
    const {user}=useSelector((store)=>store.auth)
    const dispatch=useDispatch();
    const {posts}=useSelector((store)=>store.post)

    const fileChangeHandler=async(e)=>{
     const file=e.target.files?.[0]
     if(file){
      setFile(file)
      const dataUrl =await readFileAsDataURL(file)
      setImagePreview(dataUrl)
     }


    }
    const createPostHandler=async(e)=>{
      e.preventDefault();
      // console.log(file,caption)
      const formData=new FormData();
      formData.append("caption",caption)
      if(imagePreview) formData.append("image",file)
      try {
    setLouding(true)
        const res=await axios.post("http://localhost:4000/api/v1/post/addpost",formData,{
          headers:{
            "Content-Type":"multipart/form-data"
          },
          withCredentials:true
        })
        if(res.data.success){
          dispatch(setPosts([res.data.post,...posts]))
          toast.success(res.data.message)
          setOpen(false)
         
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
      finally{
        setLouding(false)
      }
      
    }
  return (
   <Dialog open={open} >
    <DialogContent onInteractOutside={()=>setOpen(false)} className=" mb-8 items-center ml-8">
        <DialogHeader className="font-bold">Create New Post</DialogHeader>
      <div className="flex gap-8 items-center">
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt="img"/>
        <AvatarFallback>CN</AvatarFallback>
       </Avatar>
       <div>
        <h1 className="font-bold text-md">{user?.username}</h1>
        <span>Bio here...</span>
      </div>
      </div>
     <textarea name="" id="" placeholder="Add a caption" className="outline-none"
     value={caption} onChange={(e)=>setCaption(e.target.value)}></textarea>
     {
      imagePreview &&(
        <div className="w-20 h-20 flex items-center justify-center">
          <img src={imagePreview} alt="preview_image" />
        </div>
      )
     }
     <input type="file" className="hidden" ref={imageRef}  onChange={fileChangeHandler}/>
     <Button onClick={()=>imageRef.current.click()}  
      className=" bg-[#0095F6] hover:bg-[#246c9c]">Select from computer</Button>
{
  imagePreview &&(
    louding?(
      <Button>
        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
        please wait
      </Button>
    ):(
      <Button onClick={createPostHandler} className="w-full" type="submit">Post</Button>
    )
  )
}
    </DialogContent>
   </Dialog>
  )
}

export default CreatePost
