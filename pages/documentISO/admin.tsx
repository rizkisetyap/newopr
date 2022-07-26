import cn from "classnames";
import {
	FolderRounded,
	HistoryRounded,
	PictureAsPdfRounded,
	PrintRounded,
	SaveRounded,
	ShareRounded,
	Visibility,
} from "@mui/icons-material";
import {
	Box,
	Paper,
	Container,
	Grid,
	Typography,
	Card,
	Stack,
	Collapse,
	Divider,
	IconButton,
	Dialog,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Badge,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import axios from "axios";
import HOC from "components/HOC/HOC";
import { Document, Page, pdfjs } from "react-pdf";

import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { IFallback, IGroup, IKategoriDocument, IService, IUnit } from "types/ModelInterface";
import { setgid } from "process";
import { IDokumenPendukung } from ".";
import Link from "next/link";
import AdminTabelForms, { RowsInterface } from "components/DOCIS/AdminTabelForms";
import { useSession } from "next-auth/react";
import BackdropLoading from "components/MUI/BackdropLoading";
import TableDocInti from "components/DOCIS/TableDocInti";
import { PDfViewer } from "components/DOCIS/PDFViewer";
import TableDocUtama from "components/DOCIS/TableDocUtama";

interface Props {
	fallback: IFallback;
}
interface Doc {
	fileName: string;
	filePath: string;
}
const actions = [
	{ icon: <SaveRounded />, name: "Save" },
	{ icon: <PrintRounded />, name: "Print" },
	{ icon: <ShareRounded />, name: "Share" },
];
const fetcher = (key: string) => axios.get(BASE_URL + key).then((res) => res.data);
const Admin = (props: Props) => {
	const { data: groups } = useSWR("/adminiso/group", fetcher);
	const [open, setOpen] = useState(false);
	const [openUnit, setOpenUnit] = useState(false);
	const [openFile, setOpenFile] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
	const [unit, setUnit] = useState<IUnit[]>([]);
	const [fileIsos, setFileIsos] = useState<any[]>([]);
	// Mark
	const [kId, setKId] = useState<number | null>(null);
	const [lId, setLId] = useState<number | null>(null);
	const [UId, setUId] = useState<number | null>(null);
	// count
	const { data: session, status } = useSession({ required: true });
	// view
	const [preview, setPreview] = useState(false);
	const [doc, setDoc] = useState<Doc | null>(null);
	const onPreviewOpen = (filePath: string, fileName: string) => {
		setDoc({
			fileName,
			filePath,
		});
		setPreview(true);
	};
	const onPreviewClose = () => {
		setDoc(null);
		setPreview(false);
	};

	// list forms
	const { data: Forms, error: FormsError } = useFetch<RowsInterface[]>("/RegisteredForms/getall");
	const handleFolderClick = (groupId: number) => {
		const g: IGroup[] = groups.filter((g: any) => g.id == groupId);
		if (g.length > 0) {
			setSelectedGroup(g[0]);
		}
		setOpen(true);
		setKId(groupId);
		setOpenUnit(false);
	};
	const handleFolderServiceClick = (serviceId: number) => {
		if (serviceId !== null) {
			axios
				.get(BASE_URL + "/adminiso/unit?serviceId=" + serviceId)
				.then((res) => setUnit(res.data))
				.then(() => setOpenUnit(true));
		}
		setLId(serviceId);
	};
	const handleUnitClick = (unitId: number) => {
		axios.get(BASE_URL + "/adminiso/iso?unitId=" + unitId).then((res) => {
			setFileIsos(res.data);
			setOpenFile(true);
		});
		setUId(unitId);
	};
	const handlePrint = (path: string) => {
		const doc = BASE_URL.replace("api", "") + path;
		window.open(doc, "PRINT");
	};
	const handleSave = (filepath: string) => {
		window.location.href = BASE_URL.replace("api", "") + filepath;
	};

	if (status === "loading") {
		{
			return <BackdropLoading />;
		}
	}
	if (!session.user.accountRole.includes("AdminISO")) {
		return (
			<div className="h-screen w-screen grid place-content-center">
				<Typography variant="h1">AUTHORIZED PAGE 403</Typography>
			</div>
		);
	}
	return (
		<SWRConfig value={{ fallback: props.fallback }}>
			<AdminLayout title="Admin ISO">
				<Container maxWidth="xl" sx={{ pt: 4, pb: 1 }}>
					{/* <Paper elevation={0} sx={{ p: 2 }}> */}
					<Grid container className="p-2" spacing={2}>
						{/* Kelompok */}

						<Grid item xs={12} sm={6} md={4}>
							<Typography className="text-center mb-2" variant="h6">
								Kelompok
							</Typography>
							<Stack flexWrap="wrap" justifyContent="space-evenly" direction="row" gap={2}>
								{groups &&
									groups.map((g: any) => (
										<Card
											key={g.id}
											className={cn("p-4 px-6 text-gray-600 cursor-pointer transition-all duration-300", {
												["ring-2 ring-offset-2 ring-purple-500"]: kId === g.id,
											})}
											onClick={() => handleFolderClick(g.id)}
										>
											<div className="flex flex-col justify-center items-center">
												<Badge className="text-xs" badgeContent={0} color="error">
													<FolderRounded fontSize="large" />
												</Badge>
												<Typography variant="body2">{g.name}</Typography>
											</div>
										</Card>
									))}
							</Stack>
						</Grid>
						{/* Layanan */}
						<Grid item xs={12} sm={6} md={4}>
							<Typography className="text-center mb-2" variant="h6">
								Layanan
							</Typography>
							<Collapse in={open} orientation="vertical">
								{selectedGroup && (
									<Stack flexWrap="wrap" justifyContent="space-evenly" direction="row" gap={2}>
										{selectedGroup.service!.map((g: any) => (
											<Card
												key={g.id}
												className={cn(
													"px-4 py-2 text-gray-600 cursor-pointer transition-all duration-300",
													{
														["ring-2 ring-offset-2 ring-purple-500"]: lId === g.id,
													}
												)}
												onClick={() => handleFolderServiceClick(g.id)}
											>
												<div className="flex flex-col justify-center items-center">
													<FolderRounded fontSize="large" />
													<Typography variant="body2">
														{g.shortName === "KKR" ? "KR" : g.shortName}
													</Typography>
												</div>
											</Card>
										))}
									</Stack>
								)}
							</Collapse>
						</Grid>
						{/* Unit */}
						<Grid item xs={12} sm={6} lg={4}>
							<Typography className="text-center mb-2" variant="h6">
								Unit
							</Typography>
							<Collapse in={openUnit} orientation="vertical">
								{unit && (
									<Stack flexWrap="wrap" justifyContent="space-evenly" direction="row" gap={2}>
										{unit.map((g: any) => (
											<Card
												key={g.id}
												className={cn(
													"px-4 py-2 text-gray-600 cursor-pointer transition-all duration-300",
													{
														["ring-2 ring-offset-2 ring-purple-500"]: UId === g.id,
													}
												)}
												onClick={() => handleUnitClick(g.id)}
											>
												<div className="flex flex-col justify-center items-center">
													<FolderRounded fontSize="large" />
													<Typography variant="body2">
														{g.shortName.length <= 1 ? g.name : g.shortName}
													</Typography>
												</div>
											</Card>
										))}
									</Stack>
								)}
							</Collapse>
						</Grid>
					</Grid>
				</Container>
				<Divider />
				<Container maxWidth="xl" className="pt-2">
					{fileIsos && (
						<Typography className="text-center mb-2 underline underline-offset-2" variant="h6">
							Dokumen Pendukung
						</Typography>
					)}
					<Collapse in={openUnit} orientation="vertical">
						{fileIsos && (
							<Stack flexWrap="wrap" direction="row" gap={2}>
								{fileIsos.map((g: any) => (
									<Card
										className="px-4 py-2 text-gray-600"
										// onClick={() => handleFolderServiceClick(g.id)}
										key={g.id}
									>
										<div>
											<div className="flex gap-2 justify-center items-center">
												<PictureAsPdfRounded color="error" fontSize="large" />
												<div>
													<div className="flex flex-col">
														<Typography className="text-xs" variant="body2">
															{g.detailRegister.registeredForm.name}
														</Typography>
														<Typography variant="body2">{g.fileName}</Typography>
														<Typography className="text-xs italic" variant="body2">
															{g.detailRegister.registeredForm.formNumber}
														</Typography>
													</div>
												</div>
												<div className="flex justify-center items-center">
													{/* <IconButton>
														<ShareRounded />
													</IconButton> */}
													<IconButton title="Print" onClick={() => handlePrint(g.filePath)}>
														<PrintRounded />
													</IconButton>
													<IconButton onClick={() => handleSave(g.filePath)} title="save">
														<SaveRounded />
													</IconButton>
													<IconButton
														title="preview"
														onClick={() => onPreviewOpen(g.filePath, g.fileName)}
													>
														<Visibility />
													</IconButton>
													<Link passHref href={"/documentISO/history/" + g.id}>
														<IconButton title="History" component="a">
															<HistoryRounded />
														</IconButton>
													</Link>
												</div>
											</div>
										</div>
									</Card>
								))}
							</Stack>
						)}
					</Collapse>
					{doc && <PDfViewer doc={doc} onClose={onPreviewClose} open={preview} />}
				</Container>
				<Container maxWidth="xl" className="mb-8">
					{/* Tabel Forms */}
					<div className="bg-white mt-6 pb-6 rounded-md shadow-sm px-6">
						<Box className="flex justify-between py-4">
							<Typography className="text-lg mb-4 font-semibold md:text-xl" variant="h6">
								List Form Dokumen Inti &#38; Utama
							</Typography>
						</Box>
						<AdminTabelForms data={Forms} loading={!Forms && !FormsError} />
					</div>
					<div className="bg-white mt-6 pb-6 rounded-md shadow-md px-6">
						<Box className="py-4">
							<Typography className="text-lg mb-4 font-semibold md:text-xl" variant="h6">
								List Dokumen Inti
							</Typography>
							<div>
								<TableDocInti />
							</div>
						</Box>
					</div>
					<div className="bg-white mt-6 pb-6 rounded-md shadow-sm px-6">
						<Box className="py-4">
							<Typography className="text-lg mb-4 font-semibold md:text-xl" variant="h6">
								List Dokumen Utama
							</Typography>
							<div>
								<TableDocUtama />
							</div>
						</Box>
					</div>
				</Container>
			</AdminLayout>
		</SWRConfig>
	);
};

export default HOC(Admin);

export const getStaticProps: GetStaticProps = async () => {
	const groups = await axios.get(BASE_URL + "/adminiso/group").then((res) => res.data);
	const Forms: RowsInterface = await axios.get(BASE_URL + "/RegisteredForms/getall").then((res) => res.data);
	return {
		props: {
			fallback: {
				"/adminiso/group": groups,
				"/RegisteredForms/getall": Forms,
			},
		},
		revalidate: 10,
	};
};
