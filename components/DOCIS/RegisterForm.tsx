import { FolderRounded } from "@mui/icons-material";
import {
	Grid,
	TextField,
	Button,
	Box,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { useFetch, useUnitQuery } from "data/Api";
import API from "lib/ApiCrud";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { IDate, IEmploye, IGroup, IKategoriDocument, IRegisteredForm, IService, IUnit } from "types/ModelInterface";
import s from "./FormRegister.module.css";
import cn from "classnames";
import axios from "axios";
import { BASE_URL } from "lib/constants";
import { openSnackbar } from "app/reducers/uiReducer";
interface Props {
	isoForms?: IRegisteredForm[];
	services: IService[];
}
const initFormRegister: IRegisteredForm = {
	name: "",
};
export interface IJenisDokumen extends IDate {
	id?: number;
	name?: string;
	kategoriDokumenId?: number;
	kategoriDokumen?: IKategoriDocument;
}
const RegisterForm = ({ isoForms, services }: Props) => {
	const { data: session } = useSession();
	const [formData, setFormData] = useState<IRegisteredForm>(initFormRegister);
	const { data: units } = useFetch<IUnit[]>("/unit/layanan?id=" + formData.serviceId ?? "");
	const [isModalTambahUnitOpen, setIsTambahUnitOpen] = useState(false);
	const { data: kelompok } = useFetch<IGroup>("/groups/npp?Npp=" + session?.user.npp ?? "");
	const [subLayanan, setSubLayanan] = useState(units);
	const { data: typeDocs } = useFetch<IKategoriDocument[]>("/kategoriDocument/getall");
	const [katDocId, setKatDocId] = useState<number | null>(null);
	const { data: jenisDokumens } = useFetch<IJenisDokumen[]>("/jenisDokumen/kategori?id=" + (katDocId ?? 3));
	// const [antrian, setAntrian] = useState<number | null>(null);
	const kdRef = useRef<HTMLSelectElement>(null);
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();
	const [monthYear, setMonthYear] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
	};
	const handleInputSelect = (e: SelectChangeEvent<string | number>) => {
		setFormData((old) => ({ ...old, [e.target.name]: e.target.value }));
	};
	const onSuccess = () => {
		mutate("/registeredForms/getall");
		setFormData(initFormRegister);
	};
	const handleSave = async () => {
		const antrian = await axios
			.get(
				BASE_URL +
					`/registeredForms/cekAntrian?idSublayanan=${formData.subLayananId ?? ""}&idLayanan=${
						formData.serviceId ?? ""
					}&GroupId=${kelompok?.id ?? ""}`
			)
			.then((res) => res.data);
		if (!antrian) {
			return alert("Gagal mendapat no urut");
		}
		const fd: IRegisteredForm = { ...formData, noUrut: antrian!, groupId: kelompok?.id! };
		const data: any = {
			registeredForm: fd,
			month: monthYear.month,
			year: monthYear.year,
		};
		console.log(data);
		// return;
		API.handlePost<any>(data, onSuccess, dispatch, "registeredForms/registerForm");
	};
	// console.log(subLayanan);
	return (
		<Grid container spacing={{ sm: 2, md: 3 }}>
			<Grid item xs={12}>
				<Box className="p-6 my-6 border">
					<div className="flex justify-between md:justify-start md:inline-flex items-center gap-4">
						<Typography variant="h6" component="h6" className="text-lg font-semibold md:text-xl">
							Register Form
						</Typography>
						<div>
							<Button
								size="small"
								variant="contained"
								className="bg-blue-600 text-xs"
								color="primary"
								onClick={() => setIsTambahUnitOpen(true)}
							>
								Tambah Unit
							</Button>
						</div>
					</div>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" variant="standard">
								<InputLabel id="kategoriDocumentId">Kategori Dokumen</InputLabel>
								{typeDocs && (
									<Select
										name="kategoriDocumentId"
										ref={kdRef}
										value={katDocId ?? ""}
										onChange={(e) => setKatDocId(+e.target.value)}
										id="kategoriDocumentId"
									>
										{typeDocs.map((kd) => (
											<MenuItem key={kd.id} value={kd.id}>
												{kd.name}
											</MenuItem>
										))}
									</Select>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl
								// disabled={}
								fullWidth
								margin="dense"
								variant="standard"
							>
								<InputLabel id="subLayananId">Jenis Dokumen</InputLabel>
								{katDocId && (
									<Select
										value={formData.jenisDokumenId ?? ""}
										onChange={(e) => setFormData((old) => ({ ...old, jenisDokumenId: +e.target.value }))}
										name="jenisDokumenId"
										label="Jenis Dokumen"
									>
										{jenisDokumens &&
											jenisDokumens.map((u) => (
												<MenuItem value={u.id} key={u.id}>
													{u.name}
												</MenuItem>
											))}
									</Select>
								)}
							</FormControl>
						</Grid>
						{kelompok && (
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth margin="dense" disabled variant="standard">
									<InputLabel id="groupId">Kelompok</InputLabel>
									<Select defaultValue={kelompok.id}>
										<MenuItem selected value={kelompok.id}>
											{kelompok.groupName}
										</MenuItem>
									</Select>
								</FormControl>
								{/* <TextField value={kelompok.groupName} name="kelompokId" /> */}
							</Grid>
						)}
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" variant="standard">
								<InputLabel id="serviceId">Layanan</InputLabel>
								<Select
									value={formData.serviceId ?? ""}
									name="serviceId"
									labelId="serviceId"
									onChange={handleInputSelect}
								>
									{services &&
										services.map((s) => (
											<MenuItem key={s.id} value={s.id}>
												{s.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl
								disabled={!subLayanan || subLayanan.length <= 0}
								fullWidth
								margin="dense"
								variant="standard"
							>
								<InputLabel id="subLayananId">Unit</InputLabel>
								<Select
									value={formData.subLayananId ?? ""}
									onChange={handleInputSelect}
									name="subLayananId"
									label="Unit"
								>
									{subLayanan &&
										subLayanan.map((u) => (
											<MenuItem value={u.id} key={u.id}>
												{u.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								value={formData.name}
								onChange={handleInputText}
								fullWidth
								margin="dense"
								variant="standard"
								name="name"
								label="Nama Form"
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Box>
								<TextField
									fullWidth
									margin="dense"
									onChange={(e) => {
										const val = e.target.value && e.target.value.split("-"); // * 2022-07
										if (val.length) {
											setMonthYear({
												month: +val[1],
												year: +val[0],
											});
										}
									}}
									variant="standard"
									type="month"
									label="Bulan / Tahun"
								/>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								size="small"
								color="primary"
								className="bg-blue-600 text-xs mt-4 mb-2 md:text-sm"
								onClick={handleSave}
							>
								Save
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Grid>
			{services && (
				<FormNewUnit open={isModalTambahUnitOpen} onClose={() => setIsTambahUnitOpen(false)} services={services} />
			)}
		</Grid>
	);
};

export default RegisterForm;

interface FormNewUnitProps {
	open: boolean;
	onClose: () => void;
	services: IService[];
}
const FormNewUnit = (props: FormNewUnitProps) => {
	const { open, onClose, services } = props;
	const [formData, setFormData] = useState<IUnit>({ name: "" });
	const dispatch = useAppDispatch();
	const { mutate } = useSWRConfig();

	const onSuccess = () => {
		mutate("/unit");
		setFormData({ name: "" });
	};
	const handleSave = () => {
		API.handlePost(formData, onSuccess, dispatch, "unit");
	};
	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
			<DialogTitle className="bg-slate-900 text-white">Tambah Unit</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<FormControl variant="standard" size="small" fullWidth margin="dense">
							<InputLabel id="layanan">Layanan</InputLabel>
							<Select
								name="serviceId"
								value={formData.serviceId ?? ""}
								onChange={(e) => setFormData((fd) => ({ ...fd, serviceId: +e.target.value }))}
							>
								{services.map((s) => (
									<MenuItem key={s.id} value={s.id}>
										{s.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							value={formData.name}
							onChange={(e) => setFormData((fd) => ({ ...fd, name: e.target.value }))}
							fullWidth
							margin="dense"
							variant="standard"
							name="name"
							label="Nama / Kode unit"
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="contained" color="primary" className="bg-blue-600" onClick={handleSave}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
function getGroup(services: IService[], id: number): IGroup | null {
	const service = services.filter((s) => s.id === id)[0] ?? null;
	return service.group ? service.group : null;
}
