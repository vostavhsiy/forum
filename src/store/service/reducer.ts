import { createSlice } from "@reduxjs/toolkit";
import { Player } from "@/lib/audio";

interface State {
  player: Player | null;
}

const initialState: State = {
  player: null,
};

const slice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setPlayer: (state, action) => {
      state.player = action.payload;
    },
  },
});

export const { setPlayer } = slice.actions;
export default slice.reducer;
