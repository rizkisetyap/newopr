import { IconButton, Tooltip } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, { FC } from "react";

interface IProps {}
const EditButton: FC<IProps> = () => {
	return (
		<Tooltip title="edit">
			<IconButton component="a" color="primary" aria-label="edit">
				<EditRoundedIcon />
			</IconButton>
		</Tooltip>
	);
};

export default EditButton;
