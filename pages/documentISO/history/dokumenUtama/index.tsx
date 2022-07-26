import { Box, Container, IconButton, Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import AdminLayout from "components/Layout/AdminLayout";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import { BASE_URL } from "lib/constants";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import IDateInfo from "types/IDateInfo";
import { ICoreISO } from "types/ModelInterface";
import "moment/locale/id";
import { PrintRounded, SaveRounded, VisibilityRounded } from "@mui/icons-material";
import { PDfViewer } from "components/DOCIS/PDFViewer";

// * Data Grid
const columns: GridColDef[] = [
	{
		field: "id",
		hide: true,
	},
	{
		field: "name",
		headerName: "Name",
		minWidth: 200,
		flex: 2,
		valueGetter(params) {
			return params.row.isoCore.name;
		},
	},
	{
		field: "revision",
		headerName: "Revisi",
		width: 100,
		align: "center",
	},
	{
		field: "lastUpdate",
		headerName: "Last Update",
		minWidth: 200,
		flex: 1,
		valueGetter(params) {
			console.log(params.api);
			return params.row.updateDate ?? params.row.createDate;
		},
		valueFormatter(params) {
			const now = moment(new Date());
			const end = moment(params.value);
			// console.log(params.value);
			var durr = moment.duration(now.diff(end)).asDays();
			if (durr > 3) {
				return moment(params.value).calendar();
			}

			return moment(params.value).fromNow();
		},
	},
	{
		field: "Options",
		headerName: "Options",
		width: 150,
		renderCell(params) {
			const [pdfViewer, setPdfViewer] = useState(false);

			const parsedURL = BASE_URL.replace("api", "") + params.row.isoCore.filePath;
			return (
				<Box>
					<IconButton title="View" color="error" onClick={() => setPdfViewer(true)}>
						<VisibilityRounded />
					</IconButton>
					<IconButton component="a" href={parsedURL} target="_blank" rel="norefferer" title="Save" color="primary">
						<SaveRounded />
					</IconButton>
					<IconButton
						component="a"
						href={parsedURL}
						target="_blank"
						rel="norefferer"
						title="Print"
						color="success"
					>
						<PrintRounded />
					</IconButton>
					<PDfViewer
						doc={{
							fileName: params.row.name,
							filePath: params.row.isoCore.filePath,
						}}
						open={pdfViewer}
						onClose={() => setPdfViewer(false)}
					/>
				</Box>
			);
		},
	},
];

//

interface IHistoryDokumenUtama extends IDateInfo {
	id: number;
	isoCoreId: number;
	isoCore: ICoreISO;
	revision: number;
}

const HistoryDokumenUtama = () => {
	const router = useRouter();
	const { jdid, gid } = router.query;
	const [histDokumen, setHistDokumen] = useState<IHistoryDokumenUtama[]>([]);
	const [pageSize, setPageSize] = useState(10);

	useEffect(() => {
		const getHistory = async () => {
			try {
				const data = await axios
					.get(BASE_URL + `/AdminIso/DokumenUtama/History?jdid=${jdid}&gid=${gid}`)
					.then((res) => res.data);
				setHistDokumen(data);
			} catch (error) {
				alert("Error fetching data");
			}
		};
		if (gid && jdid) {
			getHistory();
		}
	}, [jdid, gid]);
	return (
		<AdminLayout title="hISTORY ">
			<Container className="bg-white" maxWidth="xl">
				<div className="bg-white p-2 min-h-[90vh]">
					<Typography variant="h4" component="h1" className="text-lg md:text-xl font-semibold mb-4">
						History
					</Typography>

					<Paper sx={{ minHeight: 300 }}>
						{histDokumen && (
							<BaseDataGrid
								columns={columns}
								rows={histDokumen}
								getRowId={(row) => row.id}
								rowsPerPageOptions={[10, 15, 20, 25, 30]}
								pageSize={pageSize}
								onPageSizeChange={(size) => setPageSize(size)}
								autoHeight
							/>
						)}
					</Paper>
				</div>
			</Container>
		</AdminLayout>
	);
};

export default HistoryDokumenUtama;
