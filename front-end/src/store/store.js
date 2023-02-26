import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import fetchDataSlice from "./features/fetchDataSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    fetchData: fetchDataSlice,
  },
});
