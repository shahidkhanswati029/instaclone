import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts:[],
    selectedPost:null,
  },
  reducers: {
    // Action
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setselectedPost:(state,action)=>{
      state.selectedPost=action.payload;
    }
  },
});

// Correctly export the action creators and reducer
export const { setPosts,setselectedPost } = postSlice.actions; // Destructure the actions here
export default postSlice.reducer;
