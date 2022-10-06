import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
   name: 'user',
   initialState: null,
   reducers: {
      setUser: (state, action) => {
         state = action.payload;
         return state;
      },
   },
});

export default userSlice;
