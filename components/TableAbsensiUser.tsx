import { GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import moment from "moment";
import "moment/locale/id";
import BaseDataGrid from "./MUI/BaseDataGrid";
export interface IAbsen {
	idEvent: number;
	namaEvent: string;
	tanggalMulai: string;
	tanggalSelesai: string;
	waktuAbsen: string;
}

const columns: GridColDef[] = [
	{
		field: "idEvent",
		hide: true,
		valueGetter(params) {
			return params.value.idEvent;
		},
	},
	{
		field: "namaEvent",
		headerName: "Event",
		width: 200,
	},
	{
		field: "tanggalMulai",
		headerName: "Event dimulai",
		width: 200,
		valueGetter(params) {
			return params.row.tanggalMulai;
		},
		valueFormatter(params: GridValueFormatterParams<string>) {
			return moment(params.value).format("DD/MM/YYYY HH:MM");
		},
	},
	{
		field: "tanggalSelesai",
		headerName: "Event Selesai",
		width: 200,
		valueGetter(params) {
			return params.row.tanggalSelesai;
		},
		valueFormatter(params) {
			return moment(params.value).format("DD/MM/YYYY HH:MM");
		},
	},
	{
		field: "waktuAbsen",
		width: 200,
		headerName: "Jam Absen",
		valueFormatter(params) {
			return moment(params.value.waktuAbsen).format("DD/MM/YYYY HH:MM");
		},
	},
];
interface ITableUser {
	rows?: IAbsen[];
}
const TableAbsensiUser = (props: ITableUser) => {
	const [ps, setPs] = useState(10);
	if (!props.rows) {
		return null;
	}
	return (
		<div>
			<BaseDataGrid
				columns={columns}
				rows={props!.rows}
				getRowId={(row) => row.idEvent}
				pageSize={ps}
				onPageSizeChange={(s) => setPs(s)}
				rowsPerPageOptions={[10, 15, 20, 25, 30]}
			/>
		</div>
	);
};

export default TableAbsensiUser;
