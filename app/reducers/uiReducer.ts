import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface State {
  sidebar: {
    open: boolean;
  };
  sidebarAccordion: {
    active: boolean;
  };
  modal: {
    isOpen: boolean;
  };
  snackbar: {
    isOpen: boolean;
    type: undefined | AlertColor;
    message: string | null;
  };
}
const initialState: State = {
  sidebar: {
    open: false,
  },
  sidebarAccordion: {
    active: false,
  },
  modal: {
    isOpen: false,
  },
  snackbar: {
    isOpen: false,
    type: undefined,
    message: null,
  },
};

export const UIReducer = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebar.open = !state.sidebar.open;
    },
    toggleAccordionSidebar(state) {
      state.sidebarAccordion.active = !state.sidebarAccordion.active;
    },
    openDrawer: ({ sidebar }) => {
      sidebar.open = true;
    },
    closeDrawer: ({ sidebar }) => {
      sidebar.open = false;
    },
    openModal(state) {
      state.modal.isOpen = true;
    },
    closeModal(state) {
      state.modal.isOpen = false;
    },
    openSnackbar(
      state,
      actions: PayloadAction<{ severity: AlertColor; message: string }>
    ) {
      state.snackbar.isOpen = true;
      state.snackbar.type = actions.payload.severity;
      state.snackbar.message = actions.payload.message;
    },
    closeSnackbar(state) {
      state.snackbar.isOpen = false;
      state.snackbar.type = undefined;
      state.snackbar.message = null;
    },
  },
});

export const {
  toggleSidebar,
  toggleAccordionSidebar,
  closeModal,
  openModal,
  openDrawer,
  closeDrawer,
  closeSnackbar,
  openSnackbar,
} = UIReducer.actions;
export const selectSidebar = (state: RootState) => state.ui;
export default UIReducer.reducer;
