import {
	Paper,
	Container,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	MenuItem,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
	DialogActions,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import axios from "axios";
import { IJenisDokumen } from "components/DOCIS/RegisterForm";
import HOC from "components/HOC/HOC";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IGroup, IKategoriDocument, IRegisteredForm, IService, IUnit } from "types/ModelInterface";

type Data = {
	groups: IGroup[];
	services: IService[];
	kDokumens: IKategoriDocument[];
	jDokumens: IJenisDokumen[];
	units: IUnit[];
};
const initialData: Data = {
	groups: [],
	jDokumens: [],
	kDokumens: [],
	services: [],
	units: [],
};
interface RegisterVM {
	month: string | number;
	year: string | number;
	registeredForm: IRegisteredForm;
}
const Page = () => {
	const { data: session, status } = useSession({ required: true });
	const dispatch = useAppDispatch();
	const [data, setData] = useState<Data>(initialData);
	const [kdokumenId, setKdokumenId] = useState<number | null>(null);
	const [jdokumenId, setJdokumenId] = useState<number | null>(null);
	const [kelompokId, setkelompokId] = useState<number | null>(null);
	const [serviceId, setServiceId] = useState<number | null>(null);
	const [unitId, setUnitId] = useState<number | null>(null);
	const [monthYear, setMonthYear] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
	const [namaForm, setNamaForm] = useState("");
	// state modal unit
	const [open, setOpen] = useState(false);

	// data fetching
	// ! Kategori dokumen
	useEffect(() => {
		const getKategoriDokumen = async () => {
			try {
				const data = await axios.get(BASE_URL + "/kategoridocument/getall").then((res) => res.data);
				setData((d) => ({ ...d, kDokumens: data }));
			} catch (error) {}
		};
		getKategoriDokumen();
	}, []);
	// ! Kelompok
	useEffect(() => {
		const getCurrenGroup = async () => {
			try {
				const group = await axios.get(BASE_URL + "/groups/getall").then((res) => res.data);
				setData((d) => ({ ...d, groups: group }));
			} catch (error) {}
		};
		if (session?.user.npp) {
			getCurrenGroup();
		}
	}, [session]);

	// listener change
	const onKategoriDokumenChange = (e: SelectChangeEvent<string | number>) => {
		setKdokumenId(+e.target.value);
		// if (kdokumenId) {
		axios.get(BASE_URL + "/jenisdokumen/kategori?id=" + e.target.value).then((res) => {
			// console.log(res);
			setData((d) => ({ ...d, jDokumens: res.data }));
		});
		// }
	};
	const onKelompokChange = async (e: SelectChangeEvent<string | number>) => {
		setkelompokId(+e.target.value);
		axios.get(BASE_URL + "/services/group?groupId=" + e.target.value).then((res) => {
			setData((d) => ({ ...d, services: res.data }));
		});
	};
	const onLayananChange = (e: SelectChangeEvent<string | number>) => {
		setServiceId(+e.target.value);
		axios.get(BASE_URL + "/unit/layanan?id=" + e.target.value).then((res) => {
			setData((d) => ({ ...d, units: res.data }));
		});
	};
	if (status === "loading") {
		return <BackdropLoading />;
	}
	const onSuccess = () => {
		setNamaForm("");
		setKdokumenId(null);
		setJdokumenId(null);
		setServiceId(null);
		setUnitId(null);
	};
	const handleSave = async () => {
		if (!kdokumenId) {
			return alert("Kategori dokumen harus diisi");
		}
		const antrian = await axios
			.get(BASE_URL + "/RegisteredForms/CekAntrian?idSublayanan=" + unitId + "&KategoriDokumenId=" + kdokumenId)
			.then((res) => res.data);
		if (!antrian) {
			return alert("No urut gagal di generate!!!");
		}
		console.log("Antrian", antrian);
		return;
		const fd: RegisterVM = {
			year: monthYear.year,
			month: monthYear.month,
			registeredForm: {
				name: namaForm,
				serviceId: serviceId!,
				groupId: kelompokId!,
				jenisDokumenId: jdokumenId!,
				noUrut: antrian!,
				subLayananId: unitId!,
			},
		};

		API.handlePost<RegisterVM>(fd, onSuccess, dispatch, "RegisteredForms/registerForm");
	};
	return (
		<AdminLayout title="">
			<Container maxWidth="xl" sx={{ py: 2 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<Typography>Buat Form Baru</Typography>
					<Button
						size="small"
						color="primary"
						onClick={() => setOpen(true)}
						variant="contained"
						className="bg-blue-600 text-xs"
					>
						Tambah Unit
					</Button>

					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth size="small" margin="dense" variant="standard">
								<InputLabel id="kdokumenId">Kategori Dokumen</InputLabel>
								<Select
									name="kdokumenId"
									labelId="kdokumenId"
									value={kdokumenId ?? ""}
									onChange={onKategoriDokumenChange}
								>
									{data.kDokumens.map((kd) => (
										<MenuItem key={kd.id} value={kd.id}>
											{kd.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth size="small" margin="dense" variant="standard">
								<InputLabel id="jdokumenId">Jenis Dokumen</InputLabel>
								<Select
									name="jdokumenId"
									labelId="jdokumenId"
									value={jdokumenId ?? ""}
									onChange={(e) => setJdokumenId(+e.target.value)}
								>
									{data.jDokumens.map((kd) => (
										<MenuItem key={kd.id} value={kd.id}>
											{kd.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth size="small" margin="dense" variant="standard">
								<InputLabel id="kelompokId">Kelompok</InputLabel>
								{data.groups && (
									<Select
										name="kelompokId"
										labelId="kelompokId"
										value={kelompokId ?? ""}
										// defaultValue={data.groups.id}
										onChange={onKelompokChange}
									>
										{data.groups.map((g) => (
											<MenuItem key={g!.id} value={g!.id}>
												{g?.groupName}
											</MenuItem>
										))}
									</Select>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth size="small" margin="dense" variant="standard">
								<InputLabel id="serviceId">Layanan</InputLabel>
								{data.services && (
									<Select
										name="serviceId"
										labelId="serviceId"
										value={serviceId ?? ""}
										onChange={onLayananChange}
									>
										{data.services?.map((s) => (
											<MenuItem selected key={s.id} value={s.id}>
												{s.shortName} ({s.name})
											</MenuItem>
										))}
									</Select>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth size="small" margin="dense" variant="standard">
								<InputLabel id="unitId">Unit / Kelolaan</InputLabel>
								<Select
									name="unitId"
									labelId="unitId"
									value={unitId ?? ""}
									onChange={(e) => setUnitId(+e.target.value)}
								>
									{data.units.map((u) => (
										<MenuItem key={u.id} value={u.id}>
											{u.shortName} ({u.name})
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
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
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								value={namaForm}
								onChange={(e) => setNamaForm(e.target.value)}
								fullWidth
								margin="dense"
								variant="standard"
								name="name"
								label="Nama Form"
							/>
						</Grid>
					</Grid>
					<Button color="primary" variant="contained" className="bg-blue-600 mt-6" onClick={handleSave}>
						Save
					</Button>
				</Paper>
				<FormNewUnit open={open} onClose={() => setOpen(false)} />
			</Container>
		</AdminLayout>
	);
};

export default HOC(Page);

interface FormProps {
	open: boolean;
	onClose: () => void;
}
const initFormUnit: IUnit = {
	name: "",
	shortName: "",
};
const FormNewUnit = (props: FormProps) => {
	const { data: services } = useFetch<IService[]>("/services/getall");
	const { onClose, open } = props;
	const [formData, setFormData] = useState(initFormUnit);
	const dispatch = useAppDispatch();
	const onSucces = () => {
		setFormData(initFormUnit);
		// onClose();
	};
	const handleSave = () => {
		API.handlePost<IUnit>(formData, onSucces, dispatch, "unit");
	};

	return (
		<Dialog maxWidth="sm" open={open} onClose={onClose}>
			<DialogTitle className="bg-slate-900 text-white">Tambah Kelolaan / Unit</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="name"
							label="Nama"
							value={formData.name}
							onChange={(e) => setFormData((fd) => ({ ...fd, name: e.target.value }))}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="shortName"
							label="Nama Alternatif / kode unit"
							value={formData.shortName}
							onChange={(e) => setFormData((fd) => ({ ...fd, shortName: e.target.value }))}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth size="small" margin="dense" variant="standard">
							<InputLabel id="serviceId">Layanan</InputLabel>
							{services && (
								<Select
									name="serviceId"
									labelId="serviceId"
									value={formData.serviceId ?? ""}
									onChange={(e) => setFormData((fd) => ({ ...fd, serviceId: +e.target.value }))}
								>
									{services?.map((s) => (
										<MenuItem selected key={s.id} value={s.id}>
											{s.shortName} ({s.name})
										</MenuItem>
									))}
								</Select>
							)}
						</FormControl>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button variant="contained" color="warning" className="bg-orange-600" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="contained" color="primary" className="bg-blue-600" onClick={handleSave}>
					save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
