import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/user.model";

// Define a type for the slice state
export interface IUserState {
  userData: IUser | null;
}

// Define the initial state using that type
const initialState: IUserState = {
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
