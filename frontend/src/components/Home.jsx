import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSideBar from "./RightSideBar";
import GetAllPost from "@/hooks/GetAllPost";
// import useFetchAllPosts from "@/hooks/GetAllPost";
import useGetAllPost from "@/hooks/GetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar/>
      <GetAllPost />
    </div>
  );
};

export default Home;
