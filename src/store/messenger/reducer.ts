import { createSlice } from "@reduxjs/toolkit";

interface State {
  newMessage: boolean | number | null;
}

const initialState: State = {
  newMessage: null,
};

const slice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      state.newMessage = action.payload;
    },
  },
});

export const { setNewMessage } = slice.actions;
export default slice.reducer;
