import { IconButton, Tooltip } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, { FC } from "react";
import { useAppSelector } from "app/hooks";

interface IProps {
	onClick: () => void;
}
const EditButton: FC<IProps> = ({ onClick }) => {
	const isDisabled = useAppSelector((s) => s.action.isLoading);
	return (
		<Tooltip title="edit">
			<IconButton disabled={isDisabled} color="primary" aria-label="edit" onClick={onClick}>
				<EditRoundedIcon />
			</IconButton>
		</Tooltip>
	);
};

export default EditButton;
