import { HistoryRounded, PrintRounded, SaveRounded, VisibilityRounded } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import { useFetch } from "data/Api";
import Link from "next/link";
import React, { useState } from "react";

const columns: GridColDef[] = [
	{
		field: "id",
		headerName: "ID",
		hide: true,
	},
	{
		field: "name",
		headerName: "Nama File",
		width: 200,
		flex: 2,
	},
	{
		field: "jenisDokumen",
		headerName: "Jenis Dokumen",
		width: 200,
		flex: 1,
	},
	{
		field: "jdid",
		hide: true,
	},
	{
		field: "gid",
		hide: true,
	},
	{
		field: "group",
		headerName: "Kelompok",
		width: 250,
		flex: 2,
	},
	{
		field: "Options",
		headerName: "Options",
		sortable: false,
		width: 200,
		flex: 1,
		renderCell(params) {
			return (
				<Box>
					<IconButton color="error" title="View">
						<VisibilityRounded />
					</IconButton>
					<IconButton color="success" title="print">
						<PrintRounded />
					</IconButton>
					<IconButton color="primary" title="Save">
						<SaveRounded />
					</IconButton>
					<Link
						passHref
						href={"/documentISO/history/dokumenUtama?jdid=" + params.row.jdid + "&gid=" + params.row.gid}
					>
						<IconButton component="a" color="default" title="History">
							<HistoryRounded />
						</IconButton>
					</Link>
				</Box>
			);
		},
	},
];

const TableDocUtama = () => {
	const [pageSize, setPageSize] = useState(10);
	const { data: dokumen, error } = useFetch<any[]>("/AdminIso/DokumenUtama");
	if (!dokumen && !error) {
		return <LinearProgress />;
	}
	if (!dokumen && error) {
		return <Typography>Error fetching data</Typography>;
	}
	return (
		<div>
			<BaseDataGrid
				rows={dokumen!}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				pageSize={pageSize}
				onPageSizeChange={(size) => setPageSize(size)}
				autoHeight
				getRowId={(row) => row.id}
				columns={columns}
			/>
		</div>
	);
};

export default TableDocUtama;
