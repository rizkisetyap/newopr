import { Backdrop, CircularProgress } from "@mui/material";
import React, { FC, useState } from "react";

const BackdropLoading: FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <Backdrop
      open={open}
      onClick={() => setOpen(false)}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="info" />
    </Backdrop>
  );
};

export default BackdropLoading;
