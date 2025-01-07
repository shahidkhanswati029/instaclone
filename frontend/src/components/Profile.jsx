import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  // console.log(userProfile);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = true;
  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  const TabChangeHandler = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2 ">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      view archive
                    </Button>

                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Add tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="">
                      unfollow
                    </Button>
                    <Button variant="secondary" className="">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#1a4765]">
                    follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-6">
                <p>
                  {userProfile?.posts.length}
                  <span className="font-semibold">posts</span>
                </p>
                <p>
                  {userProfile?.followers.length}
                  <span className="font-semibold">followers</span>
                </p>
                <p>
                  {userProfile?.following.length}
                  <span className="font-semibold">following</span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <p className="w-fit font-bold text-lg">
                  @ <span>{userProfile?.username}</span>
                </p>
                <span>👩‍💻learn code with shahid khan style</span>
                <span>👩‍💻Lets build someting new</span>
                <span>👩‍💻coding is the future</span>
                <span></span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => TabChangeHandler("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => TabChangeHandler("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="image"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black opacity-0 bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
