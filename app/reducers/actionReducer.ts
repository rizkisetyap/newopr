import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IActionReducer {
  isLoading: boolean;
  dataID: string | number | null;
}
const initAction: IActionReducer = {
  isLoading: false,
  dataID: null,
};

const actionReducer = createSlice({
  name: "action",
  initialState: initAction,
  reducers: {
    setLoading(state, actions: PayloadAction<boolean>) {
      state.isLoading = actions.payload;
    },
    setDataID(state, actions: PayloadAction<string | number | null>) {
      state.dataID = actions.payload;
    },
  },
});

export const { setLoading, setDataID } = actionReducer.actions;
export default actionReducer.reducer;
