import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/post/all", {
          withCredentials: true,
        });

        if (res.data.success) {
          console.log(res.data.posts);
          dispatch(setPosts (res.data.posts));
        } else {
          toast.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error(error.message || "An error occurred");
      }
    };

    fetchAllPosts();
  }, [dispatch]);
};

export default useGetAllPost;
