import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    postData: [],
    
  },
  reducers: {
    setPostData: (state, action) => {
      state.postData = action.payload;
    }
   
  }
});

// Export action
export const { setPostData} = postSlice.actions;

// Export reducer
export default postSlice.reducer;
