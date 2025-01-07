import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge, Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setselectedPost } from "@/redux/postSlice";
import { data } from "react-router-dom";

const Post = ({ post }) => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [text, SetText] = useState("");
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      SetText(inputText);
    } else {
      SetText("");
    }
  };

  const deletePostHandler = async () => {
    // console.log(post); // Check if post and post._id are defined
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedData = posts.filter(
          (postItem) => postItem?._id != post?._id
        );
        dispatch(setPosts(updatedData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:4000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.message) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);

        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id != user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleAddComment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/post/${post._id}/comment`,
        { text }, // The request body
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Combine with other options
        }
      );

      if (res.data.success) {
        console.log(res.data);
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        SetText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler=async ()=>{
    try {
      const res=await axios.get(`http://localhost:4000/api/v1/post/${post._id}/bookmark`,{withCredentials:true})
      if(res.data.success){
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={post.author.profilePicture} alt="avatar_image" className="h-8 w-8 rounded-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
          {
            user._id===post.author._id && <Badge variant="secondary">Author show text</Badge>
          }
          
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center text-sm">
            {
              post?.author?._id!=user._id &&<Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            }
           
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post_image"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={24}
              onClick={likeOrDislikeHandler}
              className="text-red-600 cursor-pointer"
            />
          ) : (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setselectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
     {
      comment.length>0 &&(
        <span
        onClick={() => {
          dispatch(setselectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer"
      >
        view all {comment.length} comments
      </span>
      )
     }
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex">
        <input
          type="text"
          className="outline-none w-full"
          placeholder="Add a comment"
          onChange={changeEventHandler}
          value={text}
        />
        {text && (
          <span
            onClick={handleAddComment}
            className="text-[#3BAFD8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
