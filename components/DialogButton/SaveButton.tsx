import { Button } from "@mui/material";
import React, { FC } from "react";
interface ButtonProps {
	onClick: () => void;
}
const SaveButton: FC<ButtonProps> = ({ onClick }) => {
	return (
		<Button variant="contained" color="primary" className="bg-blue-600" onClick={onClick}>
			Save
		</Button>
	);
};

export default SaveButton;
