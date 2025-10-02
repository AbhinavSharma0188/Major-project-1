import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: [],
    storyList:null,
    currentUserStory:null
    
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
     setStoryList: (state, action) => {
      state.storyList = action.payload;
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
    }
   
   
  }
  
   
  
});

// Export action
export const { setStoryData,setStoryList,setCurrentUserStory} = storySlice.actions;

// Export reducer
export default storySlice.reducer;
