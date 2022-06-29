import { Button } from "@mui/material";
import React, { FC } from "react";
interface ButtonProps {
	onClick: () => void;
}
const CancelButton: FC<ButtonProps> = ({ onClick }) => {
	return (
		<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClick}>
			Cancel
		</Button>
	);
};

export default CancelButton;
