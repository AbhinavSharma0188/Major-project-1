import { createSlice } from "@reduxjs/toolkit";

const loopSlice = createSlice({
  name: "loop",
  initialState: {
    loopData: [],
    
  },
  reducers: {
    setLoopData: (state, action) => {
      state.loopData= action.payload;
    }
   
  }
});

// Export action
export const { setLoopData} = loopSlice.actions;

// Export reducer
export default loopSlice.reducer;
