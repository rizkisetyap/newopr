import { DataGrid, DataGridProps } from "@mui/x-data-grid";

import React, { FC } from "react";
interface IProps extends DataGridProps {}
const BaseDataGrid: FC<IProps> = (props) => {
	return (
		<DataGrid
			{...props}
			density="compact"
			autoHeight
			isRowSelectable={(params) => false}
		/>
	);
};

export default BaseDataGrid;
