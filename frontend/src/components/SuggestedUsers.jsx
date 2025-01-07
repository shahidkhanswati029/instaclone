import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(
    (store) => store.auth || { suggestedUsers: [] }
  );
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-8">
        <h1 className="font-semibold text-gray-600">suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt="avatar_image"
                    className=" w-8 h-8 rounded-full object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1>
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "bio here"}
                </span>
              </div>
            </div>
            <span className="text-[#38ADF8] cursor-pointer font-bold text-xs hover:text-[#3495d6] ">
              Follow
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No suggested users available.</p> // Fallback for empty/undefined state
      )}
    </div>
  );
};

export default SuggestedUsers;
