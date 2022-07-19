import { Button, LinearProgress } from "@mui/material";
import { useAppSelector } from "app/hooks";
import React, { FC } from "react";
import cn from "classnames";
interface Props {
	color: "error" | "primary" | "warning" | "secondary" | "info" | "inherit" | "success";
	text: string;
	className?: string;
	onClick: () => void;
	size?: "small" | "medium" | "large";
}

const SaveButton: FC<Props> = (props) => {
	const { color, text, className, onClick } = props;
	const IsLoading = useAppSelector((s) => s.action.isLoading);
	const bg = cn({
		["bg-blue-600"]: color === "primary",
		["bg-orange-600"]: color === "warning",
		["bg-violet-600"]: color === "secondary",
		["bg-cyan-600"]: color === "info",
		["bg-green-600"]: color === "success",
	});
	const root = cn("disabled:bg-gray-400");
	return (
		<div className="w-full">
			<Button
				onClick={onClick}
				className={cn(root, bg, className)}
				disabled={IsLoading}
				variant="contained"
				size="small"
				color={color}
			>
				{text}
			</Button>
			{IsLoading && <LinearProgress className="my-2" />}
		</div>
	);
};
SaveButton.defaultProps = {
	className: "",
	size: "medium",
};

export default SaveButton;
