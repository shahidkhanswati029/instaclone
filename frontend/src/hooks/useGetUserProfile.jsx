import {  setUserProfile } from "@/redux/authSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
        //   console.log(res.data.posts);
          dispatch(setUserProfile (res.data.user));
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(error.message || "An error occurred");
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
