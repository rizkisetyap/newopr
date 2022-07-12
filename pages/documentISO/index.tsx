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
	TextField,
	Typography,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import axios from "axios";
import ListDocument from "components/DOCIS/ListDocument";
import RegisterForm from "components/DOCIS/RegisterForm";
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
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FILE, FileIso, ICoreISO, IEmploye, IRegisteredForm, IService } from "types/ModelInterface";

interface Props {
	session: Session;
	user: IEmploye;
	services: IService[] | null;
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

const Page = (props: Props) => {
	const { user, services } = props;
	const { data: session, status } = useSession({ required: true });
	// const { data: isoForms } = useFetch<ListForms[]>("/registeredForms/listforms");
	const [noForms, setNoForms] = useState<IDetailRegister[]>([]);
	const { data: listDocs } = useFetch<FileIso[]>("/DocumentIso/filter?npp=" + session?.user.npp);
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
		setIsoFile((file) => ({ ...file, name: dataUploadIso.fileName }));
		const data = {
			fileIso: isoFile,
			fileRegisteredIso: dataUploadIso,
			npp: session?.user.npp,
		};
		console.log(dataUploadIso);
		API.handlePost<any>(data, onSuccess, dispatch, "DocumentIso");
	};
	useEffect(() => {
		const getForms = async () => {
			try {
				const res = await axios
					.get(BASE_URL + "/registeredforms/filter?groupId=" + user.service?.groupId)
					.then((res) => res.data);
				setNoForms(res);
			} catch (error) {
				alert("Error memuat forms");
			}
		};
		if (user.service?.groupId) {
			getForms();
		}
	}, [user.serviceId]);
	if (status === "loading") {
		return <BackdropLoading />;
	}
	return (
		<AdminLayout title="DOCIS">
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Paper elevation={0} sx={{ p: 2 }}>
					<div className="text-gray-600">
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								{services && <RegisterForm services={services} />}
							</Grid>
							<Grid item xs={12} md={6}>
								<Box className="p-6 my-6 border">
									<div className="flex justify-between md:inline-flex md:justify-between md:gap-4">
										<Typography variant="h6" component="h6" className="text-lg font-semibold md:text-xl">
											Upload Document
										</Typography>
									</div>
									<Grid container spacing={2}>
										<Grid item xs={12} md={6}>
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
										<Grid item xs={12} md={6}>
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
													{noForms &&
														noForms.map((rg) => (
															<MenuItem value={rg.id} key={rg.id}>
																{rg.registeredForm?.formNumber}
															</MenuItem>
														))}
												</Select>
											</FormControl>
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
									{listDocs && <ListDocument data={listDocs} />}
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
	const services = await axios.get(BASE_URL + "/services/getall").then((res) => res.data);
	return {
		props: {
			session,
			user,
			services,
		},
	};
};

export default HOC(Page);
