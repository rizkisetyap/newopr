import { Tooltip, IconButton } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { forwardRef } from "react";

const EditLink = forwardRef((props, ref) => {
  return (
    <Tooltip ref={ref} title="edit">
      <IconButton color="primary" aria-label="edit">
        <EditRoundedIcon />
      </IconButton>
    </Tooltip>
  );
});

// const

export default EditLink;
