import { Button, DialogActions, LinearProgress } from "@mui/material";
import { useAppSelector } from "app/hooks";
import React, { FC } from "react";
import cn from "classnames";
interface Props {
	className?: string;
	onSave: () => void;
	onCancel: () => void;
}

const DialogActionButton: FC<Props> = (props) => {
	const { className, onSave, onCancel } = props;
	const IsLoading = useAppSelector((s) => s.action.isLoading);

	const root = cn("disabled:bg-gray-400");
	return (
		<div>
			<DialogActions className="w-full">
				<Button onClick={onCancel} className={cn("bg-orange-600")} variant="contained" color="warning">
					Cancel
				</Button>
				<Button
					onClick={onSave}
					className={cn("bg-blue-600")}
					disabled={IsLoading}
					variant="contained"
					color="primary"
				>
					Save
				</Button>
			</DialogActions>
			{IsLoading && <LinearProgress className="my-2" />}
		</div>
	);
};
DialogActionButton.defaultProps = {
	className: "",
};

export default DialogActionButton;
