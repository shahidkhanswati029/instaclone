import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  console.log("Posts in Redux state:", posts); // Log to debug posts

  if (!posts || !Array.isArray(posts)) {
    return <div>No posts to display or still loading...</div>; // Prevent error when posts is not an array
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
