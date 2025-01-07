import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text,setText]=useState("")
  const {selectedPost,posts}=useSelector(store=>store.post)
  const [comment,setComment]=useState([])
  const dispatch =useDispatch()
  const changeEventHandler=(e)=>{
    const inputText=e.target.value;
    if(inputText.trim()){
      setText(inputText)
    }else{
      setText("")
    }
  }
  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost.comments)
    }
  },[selectedPost])

  const handleAddComment=async()=>{
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${selectedPost._id}/comment`,
        { text }, // The request body
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Combine with other options
        }
      );
      
      
      if(res.data.success){
        console.log(res.data)
        const updatedCommentData=[...comment,res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData=posts.map(p=>
          p._id===selectedPost._id?{...p,comments:updatedCommentData}:p
        )
        dispatch(setPosts(updatedPostData))
        SetText("")
        toast.success(res.data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="w-full p-0 flex flex-col"
        >
          <div className="flex flex-col">
            <img
              src={selectedPost?.image}
              alt="post_image"
              className="w-full h-full rounded-l-lg object-cover"
            />
            <div className="w-full flex  flex-row justify-between">
              <div className="flex  justify-between p-4">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} className="h-8 w-8 rounded-full" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className=" items-center">
                  <Link className="font-bold ml-4">{selectedPost?.author?.username} </Link> <br />
                  {/* <span>Bio here...</span> */}
                </div>
              </div>
              <Dialog >
                <DialogTrigger asChild>
                  <MoreHorizontal className="mt-4 cursor-pointer"/>
                </DialogTrigger>
                <DialogContent>
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold ">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full  ">
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
             
            </div>
            <hr />
             <div>
              {
                comment.map((comment)=><Comment key={comment._id} comment={comment}/>)
              }
              
             </div>
             <div className="items-center gap-4 flex">
              <input value={text} onChange={changeEventHandler} type="text" placeholder="Add a comment" className="w-full outline-none border border-gray-200 p-2" />
              <Button disabled={!text.trim()} onClick={handleAddComment} variant="outline">Send</Button>
             </div>
          </div>
        
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
