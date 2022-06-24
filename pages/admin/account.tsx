import React, { ChangeEvent, FC, useState } from "react";
import AdminLayout from "components/Layout/AdminLayout";
import AccountTable from "components/MUI/Table/AccountTable";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import HOC from "components/HOC";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { IEmploye, IFallback, IGroup, IPosition } from "types/ModelInterface";
import { useFetch } from "data/Api";
import API from "lib/ApiCrud";
import { useAppDispatch } from "app/hooks";
import { GetStaticProps } from "next";
import axios from "axios";
import { BASE_URL } from "lib/constants";
import { SWRConfig } from "swr";

interface Props {
	fallback: IFallback;
}
const Account: FC<Props> = ({ fallback }) => {
	const [open, setOpen] = useState(false); // * Modal state
	const { data: employees } = useFetch<IEmploye[]>("/employee");

	return (
		<SWRConfig value={{ fallback }}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<AdminLayout title="Account">
					<Container maxWidth="xl" sx={{ py: 4 }}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
							}}
						>
							<Box
								display="flex"
								flexDirection={{ xs: "column", sm: "row" }}
								justifyContent="space-between"
								alignItems="center"
							>
								<Typography mb={{ xs: 2, md: 0 }} className="text-gray-600" variant="h5">
									User Account
								</Typography>
								<Box
									display="flex"
									sx={(s) => ({
										gap: 1,
									})}
								>
									<Button
										startIcon={<DownloadRoundedIcon />}
										size="small"
										className="bg-blue-600"
										variant="contained"
									>
										<span className="text-xs">Dowload Template</span>
									</Button>
									<Button
										className="bg-orange-600"
										color="warning"
										variant="contained"
										size="small"
										startIcon={<FileUploadRoundedIcon />}
									>
										<span className="text-xs">Upload</span>
									</Button>
									{/* <Link passHref href="/add/user"> */}
									<Button
										startIcon={<AddCircleRoundedIcon />}
										size="small"
										className="bg-green-600"
										color="success"
										variant="contained"
										onClick={() => setOpen(true)}
									>
										<span className="text-xs">Tambah Data</span>
									</Button>
									{/* </Link> */}
								</Box>
							</Box>
							{employees ? (
								<Box sx={{ mt: 2 }}>
									<AccountTable employees={employees} />
								</Box>
							) : (
								<Typography variant="body2">Error loading data</Typography>
							)}
						</Paper>
						<ModalAdd open={open} onClose={() => setOpen(false)} />
					</Container>
				</AdminLayout>
			</LocalizationProvider>
		</SWRConfig>
	);
};

export default HOC(Account);
interface IModalAdd {
	open: boolean;
	onClose: () => void;
}
const initForm: IEmploye = {
	npp: "",
	firstName: "",
	lastName: "",
	phoneNumber: "",
	gender: "",
	dateOfBirth: new Date("1990-01-01T00:00:00"),
};
const formLabels = Object.keys(initForm);
function ModalAdd(props: IModalAdd) {
	const { open, onClose } = props;
	const { data: group, error: groupFetchingErr } = useFetch<IGroup[]>("/groups/getall");
	const { data: jabatans, error: jabatansFetchingErr } = useFetch<IPosition[]>("/positions/getall");
	const isLoadingGroup = !group && !groupFetchingErr;
	const isLoadingJabatans = !jabatans && !jabatansFetchingErr;
	const [formData, setFormData] = useState<IEmploye>(initForm);
	const dispatch = useAppDispatch();
	const handleInputText = (event: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[event.target.name]: event.target.value,
		}));
	};
	const handleInputSelect = (event: SelectChangeEvent<String>) => {
		setFormData((old) => ({
			...old,
			[event.target.name]: +event.target.value,
		}));
	};
	const handleSubmit = () => {
		API.handlePost<IEmploye>(formData, onSubmitSuccess, dispatch, "Employee");
	};
	const onSubmitSuccess = () => {
		setFormData(initForm);
		onClose();
	};
	return (
		<Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
			<DialogTitle>
				<Typography className="font-bold text-gray-600" variant="h5" component="span">
					New User
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					{formLabels.map((label) => {
						if (label === "gender" || label === "dateOfBirth") {
							return null;
						}
						return (
							<Grid key={label} item xs={12} sm={6}>
								<TextField
									fullWidth
									margin="dense"
									label={label.toUpperCase()}
									name={label}
									value={formData[label]}
									variant="standard"
									onChange={handleInputText}
									size="small"
								/>
							</Grid>
						);
					})}
					<Grid item xs={12} sm={4}>
						<FormControl variant="standard" fullWidth size="small" margin="dense">
							<InputLabel id="gender">GENDER</InputLabel>
							<Select
								variant="standard"
								labelId="gender"
								id="gender-select"
								name="gender"
								value={formData?.gender}
								onChange={handleInputSelect}
							>
								<MenuItem value="0">Male</MenuItem>
								<MenuItem value="1">Female</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={4}>
						<FormControl variant="standard" fullWidth size="small" margin="dense">
							<InputLabel id="jabatan">Jabatan</InputLabel>
							<Select
								variant="standard"
								labelId="jabatan"
								id="jabatan-select"
								name="positionId"
								value={(formData?.positionId ?? "") as String}
								onChange={handleInputSelect}
							>
								{isLoadingJabatans && <MenuItem value="0">Loading...</MenuItem>}
								{jabatans?.map((jabatan) => (
									<MenuItem key={jabatan.id + jabatan.positionName!} value={jabatan.id}>
										{jabatan.positionName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={4}>
						<FormControl variant="standard" fullWidth size="small" margin="dense">
							<InputLabel id="kelompok">Kelompok</InputLabel>
							<Select
								variant="standard"
								labelId="kelompok"
								id="kelompok-select"
								name="groupId"
								value={(isLoadingGroup ? 0 : formData?.groupId ?? "") as String}
								onChange={handleInputSelect}
							>
								{isLoadingGroup && <MenuItem value={0}>Loading...</MenuItem>}
								{group?.map((g) => (
									<MenuItem key={g!.id + g.groupName!} value={g.id}>
										{g.groupName}
									</MenuItem>
								))}
								{/* <MenuItem value="1">Female</MenuItem> */}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={4}>
						<DesktopDatePicker
							label="Tanggal Lahir"
							inputFormat="dd/MM/yyyy"
							value={formData.dateOfBirth}
							renderInput={(params) => <TextField variant="standard" fullWidth margin="dense" {...params} />}
							onChange={(date) => setFormData((old) => ({ ...old, dateOfBirth: date! }))}
						/>
					</Grid>
				</Grid>
				{/* <TextField fullWidth margin="dense" label="firs" /> */}
			</DialogContent>
			<DialogActions>
				<Button className="bg-orange-600" color="warning" variant="contained" onClick={onClose}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} className="bg-blue-600" color="primary" variant="contained">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const data = await axios.get(BASE_URL + "/employee").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/employee": data,
			},
		},
	};
};
