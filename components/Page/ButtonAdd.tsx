import { AddCircleRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAppSelector } from "app/hooks";
import React, { FC } from "react";
interface ButtonProps {
	onClick: () => void;
}
const ButtonAdd: FC<ButtonProps> = ({ onClick }) => {
	const isDisabled = useAppSelector((s) => s.action.isLoading);
	return (
		<Button
			variant="contained"
			size="small"
			className="text-xs bg-green-600"
			color="success"
			startIcon={<AddCircleRounded />}
			onClick={onClick}
			disabled={isDisabled}
		>
			<span className="text-xs">Tambah Data</span>
		</Button>
	);
};

export default ButtonAdd;
