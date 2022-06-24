import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { FC, MouseEvent } from "react";
import { useAppSelector } from "app/hooks";
interface IProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}
const DeleteButton: FC<IProps> = ({ onClick }) => {
  const isDisabled = useAppSelector((s) => s.action.isLoading);
  return (
    <Tooltip title="delete">
      <IconButton
        disabled={isDisabled}
        color="error"
        onClick={onClick}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteButton;
