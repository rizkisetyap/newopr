import { Button } from "@mui/material";
import React, { FC } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
interface IProps {
	onClick: () => void;
	title?: string;
}
const FormSubmitButton: FC<IProps> = ({ onClick, title }) => {
	return (
		<Button
			onClick={onClick}
			variant="contained"
			className="bg-blue-600 m-0"
			endIcon={<SendRoundedIcon />}
			type="button"
		>
			{title ?? "Save"}
		</Button>
	);
};

export default FormSubmitButton;
