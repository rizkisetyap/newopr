import { HistoryRounded, PrintRounded, SaveRounded, VisibilityRounded } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import { useFetch } from "data/Api";
import { BASE_URL } from "lib/constants";
import Link from "next/link";
import { IDokumenPendukung } from "pages/documentISO";
import React, { useState } from "react";
import { PDfViewer } from "./PDFViewer";
export interface IDokumenInti extends IDokumenPendukung {}
const columns: GridColDef[] = [
	{
		field: "id",
		hide: true,
		width: 50,
		headerName: "ID",
	},
	{
		field: "fileName",
		hideable: true,
		width: 250,
		headerName: "Nama File",
		flex: 1,
	},
	{
		field: "formNumber",
		hideable: true,
		width: 300,
		headerName: "No Forms",
		flex: 2,
	},
	{
		field: "group",
		hideable: true,
		width: 250,
		headerName: "Kelompok",
		valueGetter(params) {
			return params.row.kelompok.groupName;
		},
	},
	{
		field: "filePath",
		headerName: "Options",
		hideable: false,
		width: 150,
		hide: false,
		flex: 1,
		renderCell(params) {
			const [open, setOpen] = useState(false);
			const doc = {
				fileName: params.row.fileName,
				filePath: params.row.filePath,
			};
			const handleSave = (filepath: string) => {
				window.location.href = BASE_URL.replace("api", "") + filepath;
			};
			return (
				<div>
					<IconButton onClick={() => setOpen(true)} color="error" title="view">
						<VisibilityRounded />
					</IconButton>
					<IconButton color="primary" title="save" onClick={() => handleSave(doc.filePath)}>
						<SaveRounded />
					</IconButton>
					<IconButton color="success" title="Print" onClick={() => handleSave(doc.filePath)}>
						<PrintRounded />
					</IconButton>
					<Link passHref href={"/documentISO/history/" + params.row.id}>
						<IconButton component="a" title="History">
							<HistoryRounded />
						</IconButton>
					</Link>
					<PDfViewer doc={doc} onClose={() => setOpen(false)} open={open} />
				</div>
			);
		},
	},
];
const TableDocInti = () => {
	const [pageSize, setPageSize] = useState(10);
	const { data: dokumenInti } = useFetch<IDokumenInti[]>("/AdminIso/DokumenInti");

	if (!dokumenInti) {
		return <Typography>error loading data</Typography>;
	}
	return (
		<div>
			<BaseDataGrid
				rows={dokumenInti}
				autoHeight
				pageSize={pageSize}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
				onPageSizeChange={(size) => setPageSize(size)}
				columns={columns}
			/>
		</div>
	);
};

export default TableDocInti;
