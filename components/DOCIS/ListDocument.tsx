import { DownloadForOfflineRounded, EditRounded, VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import React, { useState } from "react";
import { FileIso } from "types/ModelInterface";

const columns: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		width: 50,
	},
	{
		field: "fileName",
		headerName: "Nama File",
		minWidth: 150,
		flex: 1,
	},
	{
		field: "nameForm",
		headerName: "Nama Form",
		minWidth: 150,
		flex: 1,
		valueGetter(params: GridValueGetterParams<any, FileIso>) {
			return params.row.detailRegister?.registeredForm.name;
		},
	},
	{
		field: "formNumber",
		headerName: "No Register Form",
		minWidth: 150,
		flex: 1,
	},
	{
		field: "options",
		headerName: "Options",
		width: 200,
		renderCell(params: GridRenderCellParams<any, FileIso>) {
			return (
				<Box>
					<IconButton color="default" title="download">
						<DownloadForOfflineRounded />
					</IconButton>
					<IconButton color="warning" title="info">
						<VisibilityRounded />
					</IconButton>
					<IconButton color="primary" title="edit">
						<EditRounded />
					</IconButton>
				</Box>
			);
		},
	},
];

interface Props {
	data: FileIso[];
}
const ListDocument = (props: Props) => {
	const [pageSize, setPageSize] = useState(10);
	return (
		<Box overflow="hidden" minHeight={400}>
			<BaseDataGrid
				pageSize={pageSize}
				onPageSizeChange={(size) => setPageSize(size)}
				columns={columns}
				rows={props.data}
				getRowId={(row) => row.id}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
			/>
		</Box>
	);
};

export default ListDocument;
