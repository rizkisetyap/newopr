import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { closeSnackbar } from "app/reducers/uiReducer";
import React from "react";

const Notif = () => {
  const notifState = useAppSelector((s) => s.ui.snackbar);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      open={notifState.isOpen}
      autoHideDuration={6000}
      onClose={() => dispatch(closeSnackbar())}
    >
      <Alert
        onClose={() => dispatch(closeSnackbar())}
        severity={notifState.type}
        sx={{ width: "100%" }}
      >
        {notifState.message}
      </Alert>
    </Snackbar>
  );
};

export default Notif;
