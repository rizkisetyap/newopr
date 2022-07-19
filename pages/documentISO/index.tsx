import {
	DeleteRounded,
	DownloadRounded,
	EditRounded,
	FolderRounded,
	Upload,
	VisibilityRounded,
} from "@mui/icons-material";
import { Document, Page as DocPage, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import {
	Box,
	Button,
	Chip,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import cn from "classnames";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "app/hooks";
import axios from "axios";
import ModalPendukung from "components/DOCIS/Modal/ModalPendukung";
import { IJenisDokumen } from "components/DOCIS/RegisterForm";
import HOC from "components/HOC/HOC";
import FileInput from "components/Input/FileInput";
import AdminLayout from "components/Layout/AdminLayout";
import BackdropLoading from "components/MUI/BackdropLoading";
import BaseDataGrid from "components/MUI/BaseDataGrid";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { GetServerSideProps, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import moment from "moment";
moment.locale("id");
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
import { openSnackbar } from "app/reducers/uiReducer";
import { useSWRConfig } from "swr";
import SaveButton from "components/Button/SaveButton";
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
export interface IDokumenPendukung {
	filePath: string;
	fileName: string;
	formNumber: string;
	revisi: number;
	lastUpdate: Date;
	id: number;
}

const TPendukungColumns: GridColDef[] = [
	{
		field: "formNumber",
		headerName: "No Form",
		minWidth: 300,
	},
	{
		field: "fileName",
		headerName: "Nama",
		minWidth: 250,
		flex: 1,
	},
	{
		field: "lastUpdate",
		headerName: "Last Update",
		width: 200,
		valueFormatter(params) {
			const now = moment(new Date());
			const end = moment(params.value);
			var durr = moment.duration(now.diff(end)).asDays();
			if (durr > 3) {
				return moment(params.value).calendar();
			}

			return moment(params.value).fromNow();
		},
	},
	{
		field: "Options",
		width: 200,
		renderCell(params) {
			// Modal
			const [openP, setOpenP] = useState(false);
			const dispatch = useAppDispatch();
			const { mutate } = useSWRConfig();
			const { data: session } = useSession();
			const [preview, setPreview] = useState(false);

			const handleDelete = () => {
				const yakin = confirm("Yakin hapus?");
				if (!yakin) {
					return;
				}
				axios
					.delete(BASE_URL + "/DocumentIso/" + params.row.id)
					.then((res) => {
						if (res.status == 200) {
							dispatch(openSnackbar({ severity: "success", message: "Dokumen Terhapus" }));
							if (session) {
								mutate("/DocumentIso/DokumenPendukung?npp=" + session.user.npp);
							}
						}
					})
					.catch((e) => {
						dispatch(openSnackbar({ severity: "error", message: (e as any).message }));
					});
			};
			return (
				<Box>
					<IconButton color="info" title="Edit" onClick={() => setOpenP(true)}>
						<EditRounded />
					</IconButton>
					<IconButton onClick={handleDelete} color="error" title="Hapus">
						<DeleteRounded />
					</IconButton>
					<IconButton onClick={() => setPreview(true)} color="info" title="View">
						<VisibilityRounded />
					</IconButton>

					<ModalPendukung doc={params.row} onClose={() => setOpenP(false)} open={openP} />
					<PDfViewer open={preview} onClose={() => setPreview(false)} doc={params.row} />
				</Box>
			);
		},
	},
];
interface IPdfViewer {
	open: boolean;
	onClose: () => void;
	doc: IDokumenPendukung;
}
const PDfViewer = (props: IPdfViewer) => {
	// pdf view
	const [documentPage, setDocumentPage] = useState(1);
	const [numPageDoc, setNumPageDoc] = useState<number | null>(null);
	const onLoadDocSuccess = ({ numPages }: any) => {
		setNumPageDoc(numPages);
	};
	const endocedUri = BASE_URL.replace("api", "") + props.doc.filePath;
	return (
		<Dialog fullScreen open={props.open} onClose={props.onClose}>
			<DialogTitle className="bg-slate-900 text-white">{props.doc.fileName}</DialogTitle>
			<DialogContent className="mx-auto">
				<Document file={endocedUri} onLoadSuccess={onLoadDocSuccess}>
					{[...new Array(numPageDoc).fill(1)].map((el, i) => (
						<DocPage key={i + 1} pageNumber={i + 1} />
					))}
				</Document>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<Button color="warning" className="bg-orange-600" onClick={props.onClose} variant="contained">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const Page = (props: Props) => {
	const { data: session, status } = useSession({ required: true });

	const { data: IsoPendukung } = useFetch<IDokumenPendukung[]>(
		"/DocumentIso/DokumenPendukung?GroupId=" + session?.user.employee.service?.groupId
	);
	const { data: regForms } = useFetch<IDetailRegister[]>(
		"/RegisteredForms/Filter?GroupId=" + session?.user.employee.service?.groupId
	);
	const { data: currentUser } = useFetch<IEmploye>("/employee/by?id=" + session?.user?.npp ?? "");
	const serviceId = currentUser?.serviceId ?? "";
	const groupId = currentUser?.service?.groupId ?? "";
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

	// mutation
	const { mutate } = useSWRConfig();
	// loading state
	const isLoading = useAppSelector((s) => s.action.isLoading);
	// Table components
	const [TpendukungSize, setTpendukungSize] = useState(10);

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
		mutate("/DocumentIso/DokumenPendukung?GroupId=" + session?.user.employee.service?.groupId);
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
					`/RegisteredForms/search?ServiceId=${serviceId}&KategoriDocumentId=${e.target.value}&unitId=${
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
					`/RegisteredForms/search?ServiceId=${serviceId}&KategoriDocumentId=${kdokumenId}&unitId=${
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
				const unts = await axios.get(BASE_URL + "/Unit/layanan?id=" + serviceId).then((res) => res.data);
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
				const newUnits = await axios.get(BASE_URL + "/Unit/Search?GroupId=" + groupId).then((res) => res.data);
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
						<Link href="/documentISO/createform" passHref>
							<Chip label="Buat Form Baru" component="a" variant="outlined" color="secondary" />
						</Link>
						<Grid container spacing={2}>
							<Grid item xs={12} md={5}>
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
											<FileInput acccept="application/pdf" ref={inputFileRef} onChange={handleFileChange} />
										</Grid>
										<Grid item xs={12}>
											<SaveButton color="primary" text="Save" onClick={handleSave} />
										</Grid>
									</Grid>
								</Box>
							</Grid>
							<Grid item xs={12} md={7}>
								<Paper className="mt-6" sx={{ width: "100%", overflow: "hidden" }}>
									<TableContainer sx={{ maxHeight: 540 }}>
										<Table
											sx={{
												fontSize: 14,
												mt: 2,
											}}
											stickyHeader
											aria-label="sticky table"
										>
											<TableHead>
												<TableRow
													sx={{
														backgroundColor: "#ccc",
													}}
												>
													<TableCell component="th">ID</TableCell>
													<TableCell component="th">No Form</TableCell>
													<TableCell component="th">Nama Form</TableCell>
													<TableCell component="th">Tanggal Dibuat</TableCell>
													<TableCell component="th">Options</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{regForms &&
													regForms.map((f, idx) => (
														<TableRow
															className={cn({
																["bg-gray-200"]: idx % 2 === 0,
															})}
															key={f.id}
														>
															<TableCell>{f.id}</TableCell>
															<TableCell>{f.registeredForm?.formNumber}</TableCell>
															<TableCell>{f.registeredForm?.name}</TableCell>
															<TableCell>
																{moment(f.registeredForm?.createDate?.toString()).calendar()}
															</TableCell>
															<TableCell>
																<IconButton color="primary" title="Edit">
																	<EditRounded />
																</IconButton>
																<IconButton color="error" title="Hapus">
																	<DeleteRounded />
																</IconButton>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</TableContainer>
								</Paper>
							</Grid>
							<Grid item xs={12}>
								<Box className="p-6 my-6 border">
									<div className="flex justify-between md:inline-flex md:justify-between md:gap-4">
										<Typography component="h6" className="text-lg font-semibold md:text-xl" variant="h6">
											List Document Pendukung
										</Typography>
									</div>
									{IsoPendukung && (
										<BaseDataGrid
											rows={IsoPendukung!}
											columns={TPendukungColumns}
											autoHeight
											rowsPerPageOptions={[10, 15, 20, 25, 30]}
											getRowId={(row) => row.id}
											pageSize={TpendukungSize}
											onPageSizeChange={(s) => setTpendukungSize(s)}
										/>
									)}
								</Box>
							</Grid>
						</Grid>
					</div>
				</Paper>
			</Container>
		</AdminLayout>
	);
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// 	const session = await getSession(ctx);

// 	if (!session) {
// 		return {
// 			redirect: {
// 				destination: "/",
// 				permanent: false,
// 			},
// 		};
// 	}
// 	const user: IEmploye = await axios.get(BASE_URL + "/employee/by?id=" + session.user.npp).then((res) => res.data);
// 	const groupId = user.service?.groupId;
// 	return {
// 		props: {
// 			serviceId: user.serviceId,
// 			groupId,
// 		},
// 	};
// };

// export const getStaticProps: GetStaticProps = async (ctx) => {
// 	const session = await getSession(ctx.params);
// 	console.log(session);
// 	if (!session) {
// 		return {
// 			notFound: true,
// 		};
// 	}
// 	const user: IEmploye = await axios.get(BASE_URL + "/employee/by?id=" + session.user.npp).then((res) => res.data);
// 	const groupId = user.service?.groupId;
// 	return {
// 		props: {
// 			serviceId: user.serviceId,
// 			groupId,
// 		},
// 	};
// };

export default HOC(Page);
