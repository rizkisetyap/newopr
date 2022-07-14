import { FolderRounded, Upload } from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	FormControl,
	Grid,
	InputLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import axios from "axios";
import ListDocument from "components/DOCIS/ListDocument";
import RegisterForm, { IJenisDokumen } from "components/DOCIS/RegisterForm";
import HOC from "components/HOC/HOC";
import FileInput from "components/Input/FileInput";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
	FILE,
	FileIso,
	ICoreISO,
	IEmploye,
	IGroup,
	IKategoriDocument,
	IRegisteredForm,
	IService,
	IUnit,
} from "types/ModelInterface";

interface Props {
	serviceId: number;
	groupId: number;
}
interface IDetailRegister {
	id?: number;
	registeredFormId?: number;
	revisi?: number;
	registeredForm?: IRegisteredForm;
}
interface ListForms {
	regId: number;
	no: string;
	namaForm: string;
}
const initialDataIso: FileIso = {
	fileName: "",
};

interface ILForms {
	id: number;
	noForm: string;
	formName: string;
}

const Page = (props: Props) => {
	const { data: session, status } = useSession({ required: true });
	const [LKategoriDokumen, setLKategoriDokumen] = useState<IKategoriDocument[]>([]);
	const [LJenisDokumen, setLJenisDokumen] = useState<IJenisDokumen[]>([]);
	const [LForms, setLForms] = useState<ILForms[]>([]);
	const [LUnits, setLUnits] = useState<IUnit[]>([]);

	const [kdokumenId, setKdokumenId] = useState<number | null>(null);
	const [jdokumenId, setJdokumenId] = useState<number | null>(null);
	const [unitId, setUnitId] = useState<number | null>(null);

	const [dataUploadIso, setDataUploadIso] = useState(initialDataIso);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [isoFile, setIsoFile] = useState<FILE | null>(null);
	const dispatch = useAppDispatch();
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target?.files?.item(0);
		const fr = new FileReader();

		if (files !== null || files !== undefined) {
			fr.onloadend = (result) => {
				const base64 = result.target?.result;
				setIsoFile((file) => ({
					...file,
					base64str: base64?.toString(),
					extension: files!.name.match(/[^\\]*\.(\w+)$/)![1],
					name: files!.name,
					type: files!.type,
				}));
			};
		}

		if (files) {
			fr.readAsDataURL(files);
		}
	};
	const onSuccess = () => {
		inputFileRef!.current!.value = "";
		setDataUploadIso(initialDataIso);
	};
	const handleSave = () => {
		if (kdokumenId == 2) {
			const data: any = {
				iSOCore: {
					name: dataUploadIso.fileName,
					unitId: unitId,
					jenisDokumenId: jdokumenId,
				},
				fileIso: isoFile,
			};
			return API.handlePost<any>(data, onSuccess, dispatch, "DokumenUtama/insert");
		}
		setIsoFile((file) => ({ ...file, name: dataUploadIso.fileName }));
		const data = {
			fileIso: isoFile,
			fileRegisteredIso: dataUploadIso,
			npp: session?.user.npp,
		};
		// console.log(dataUploadIso);
		return API.handlePost<any>(data, onSuccess, dispatch, "DocumentIso");
	};
	// listener change
	const onKategoriDokumenChange = (e: SelectChangeEvent<string | number>) => {
		setKdokumenId(+e.target.value);
		// if (kdokumenId) {
		axios.get(BASE_URL + "/jenisdokumen/kategori?id=" + e.target.value).then((res) => {
			// console.log(res);
			setLJenisDokumen(res.data);
		});
		// }
	};
	const onJenisDokumenChange = (e: SelectChangeEvent<string | number>) => {
		setJdokumenId(+e.target.value);
		axios
			.get(
				BASE_URL +
					`/RegisteredForms/search?ServiceId=${props.serviceId}&KategoriDocumentId=${e.target.value}&unitId=${
						unitId ?? ""
					}`
			)
			.then((res) => {
				setLForms(res.data);
			});
	};
	const UnitChange = (e: SelectChangeEvent<string | number>) => {
		setUnitId(+e.target.value);
		axios
			.get(
				BASE_URL +
					`/RegisteredForms/search?ServiceId=${props.serviceId}&KategoriDocumentId=${kdokumenId}&unitId=${
						e.target.value ?? ""
					}`
			)
			.then((res) => {
				setLForms(res.data);
			});
	};
	// Data fetching
	useEffect(() => {
		const getKategoriDokumen = async () => {
			try {
				const kd = await axios.get(BASE_URL + "/kategoriDocument/getall").then((res) => res.data);
				setLKategoriDokumen(kd);
			} catch (error) {}
		};
		getKategoriDokumen();
	}, []);
	useEffect(() => {
		const getUnits = async () => {
			try {
				const unts = await axios.get(BASE_URL + "/Unit/layanan?id=" + props.serviceId).then((res) => res.data);
				setLUnits(unts);
			} catch (error) {}
		};
		if (kdokumenId !== 2) {
			getUnits();
		}
	}, [kdokumenId]);
	useEffect(() => {
		const UpdateUnit = async () => {
			try {
				const newUnits = await axios
					.get(BASE_URL + "/Unit/Search?GroupId=" + props.groupId)
					.then((res) => res.data);
				setLUnits(newUnits);
			} catch (error) {}
		};
		if (kdokumenId == 2) {
			UpdateUnit();
		}
	}, [kdokumenId]);

	if (status === "loading") {
		return <BackdropLoading />;
	}
	return (
		<AdminLayout title="DOCIS">
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<div className="text-gray-600">
						<Link href="/documentISO/createform">
							<a href="">Buat Form</a>
						</Link>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<Box className="p-6 my-6 border">
									<div className="flex justify-between md:inline-flex md:justify-between md:gap-4">
										<Typography variant="h6" component="h6" className="text-lg font-semibold md:text-xl">
											Upload Document
										</Typography>
									</div>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<FormControl fullWidth size="small" margin="dense" variant="standard">
												<InputLabel id="kdokumenId">Kategori Dokumen</InputLabel>
												<Select
													name="kdokumenId"
													labelId="kdokumenId"
													value={kdokumenId ?? ""}
													onChange={onKategoriDokumenChange}
												>
													{LKategoriDokumen.map((kd) => (
														<MenuItem key={kd.id} value={kd.id}>
															{kd.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12}>
											<FormControl fullWidth size="small" margin="dense" variant="standard">
												<InputLabel id="jdokumenId">Jenis Dokumen</InputLabel>
												<Select
													name="jdokumenId"
													labelId="jdokumenId"
													value={jdokumenId ?? ""}
													onChange={onJenisDokumenChange}
												>
													{LJenisDokumen.map((kd) => (
														<MenuItem key={kd.id} value={kd.id}>
															{kd.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12}>
											<FormControl fullWidth size="small" margin="dense" variant="standard">
												<InputLabel id="unitId">Unit / Kelola</InputLabel>
												<Select name="unitId" labelId="unitId" value={unitId ?? ""} onChange={UnitChange}>
													{LUnits.map((kd) => (
														<MenuItem key={kd.id} value={kd.id}>
															{kd.shortName} - {kd.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										{kdokumenId !== 2 && (
											<Grid item xs={12}>
												<FormControl fullWidth margin="dense" variant="standard">
													<InputLabel id="detailRegisterId">No Form</InputLabel>
													<Select
														required
														value={dataUploadIso.DetailRegisterId ?? ""}
														onChange={(e) =>
															setDataUploadIso((fd) => ({ ...fd, DetailRegisterId: +e.target.value }))
														}
														labelId="detailRegisterId"
														name="detailRegisterId"
													>
														{LForms.map((rg) => (
															<MenuItem value={rg.id} key={rg.id}>
																{rg.noForm} - {rg.formName}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>
										)}
										<Grid item xs={12}>
											<TextField
												required
												fullWidth
												margin="dense"
												variant="standard"
												name="fileName"
												label="Nama file"
												id="namafile"
												value={dataUploadIso.fileName}
												onChange={(e) => setDataUploadIso((fd) => ({ ...fd, fileName: e.target.value }))}
											/>
										</Grid>

										<Grid item xs={12}>
											<FileInput ref={inputFileRef} onChange={handleFileChange} />
										</Grid>
										<Grid item xs={12}>
											<Button
												variant="contained"
												color="primary"
												className="text-sm bg-blue-600 mt-4"
												onClick={handleSave}
											>
												Save
											</Button>
										</Grid>
									</Grid>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Box className="p-6 my-6 border">
									<div className="flex justify-between md:inline-flex md:justify-between md:gap-4">
										<Typography component="h6" className="text-lg font-semibold md:text-xl" variant="h6">
											List Document Iso
										</Typography>
									</div>
									{/* {listDocs && <ListDocument data={listDocs} />} */}
								</Box>
							</Grid>
						</Grid>
					</div>
				</Paper>
			</Container>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	const user: IEmploye = await axios.get(BASE_URL + "/employee/by?id=" + session.user.npp).then((res) => res.data);
	const groupId = user.service?.groupId;
	return {
		props: {
			serviceId: user.serviceId,
			groupId,
		},
	};
};

export default HOC(Page);
