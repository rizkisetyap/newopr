import { Button, IconButton } from "@mui/material";
import React, { FC } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
interface IProps {
  onClick: () => void;
}
const NewButton: FC<IProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      className="bg-blue-600 text-sm"
      aria-label="new"
      color="primary"
      size="small"
      startIcon={<AddCircleRoundedIcon />}
      onClick={onClick}
      type="button"
    >
      new
    </Button>
  );
};

export default NewButton;
