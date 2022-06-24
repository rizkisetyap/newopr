import { Button } from "@mui/material";
import React, { FC } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
interface IProps {
  onClick: () => void;
}
const ModalCancelButton: FC<IProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      className="bg-red-600"
      endIcon={<CancelRoundedIcon />}
      color="error"
      size="small"
      type="button"
    >
      Cancel
    </Button>
  );
};

export default ModalCancelButton;
