import AdminLayout from "components/Layout/AdminLayout";
import { useFetch } from "data/Api";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import EventTable from "components/MUI/Table/EventTable";
import { ChangeEvent, FC, useState } from "react";
import HOC from "components/HOC/HOC";
import { AddCircleRounded } from "@mui/icons-material";
import axios from "axios";
import { useAppDispatch } from "app/hooks";
import { IEvent, IFallback } from "types/ModelInterface";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import API from "lib/ApiCrud";
import { BASE_URL, formatDate } from "lib/constants";
import { SWRConfig, useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { GetStaticProps } from "next";
const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJucHAiOiIxMDIxMzEiLCJuYW1lIjoiQWxkaWFuIiwiZXhwIjoyNjAyNTQ3MjU0LCJpc3MiOiJEYXRhYmFzZSJ9.W1oq-JQydUJxkT0nmn6HCBg_wiLHMi2ZY4RsOY61slU";
const idEvent = 8;
interface Props {
	fallback: IFallback;
}
const Content: FC<Props> = ({ fallback }) => {
	const { data: events, error } = useFetch<IEvent[]>("/events/getAll");
	const { mutate } = useSWRConfig();
	const [open, setOpen] = useState(false);
	// const [qr, setQr] = useState<any>(null);
	// const [img, setImg] = useState<null | string>(null);

	// useEffect(() => {
	// 	axios.get(`https://localhost:7211/api/Presence/${idEvent}`).then((res) => {
	// 		setQr(res.data);
	// 		// console.log(res.data);
	// 	});
	// }, []);

	// useEffect(() => {
	// 	if (qr) {
	// 		fetch(qr.qrSrc)
	// 			.then((res) => res.blob())
	// 			.then((blob) => {
	// 				const image = URL.createObjectURL(blob);
	// 				setImg(image);
	// 			});
	// 	}
	// }, [qr]);

	return (
		<SWRConfig value={{ fallback }}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<AdminLayout title="Event ">
					<Container maxWidth="xl" sx={{ py: 4 }}>
						<Paper elevation={0} sx={{ p: 2 }}>
							<Box display="flex" justifyContent="space-between">
								<Typography className="text-gray-600" fontWeight={500} variant="h5">
									Events
								</Typography>
								<Button
									color="success"
									variant="contained"
									size="small"
									className="bg-green-600"
									startIcon={<AddCircleRounded />}
									onClick={() => setOpen(true)}
									// className
								>
									Tambah Data
								</Button>
							</Box>
							{events ? (
								<Box sx={{ mt: 2 }}>
									<EventTable events={events} />
								</Box>
							) : (
								<Typography variant="body2">Error loading data</Typography>
							)}
							{/* {img && <img src={img} />} */}
							<ModalForm open={open} onClose={() => setOpen(false)} mutate={mutate} />
						</Paper>
					</Container>
				</AdminLayout>
			</LocalizationProvider>
		</SWRConfig>
	);
};

export default HOC(Content);

interface IModalForm {
	open: boolean;
	onClose: () => void;
	mutate: ScopedMutator;
}
const initForm: IEvent = {
	eventName: "",
	eventTheme: "",
	organizer: "",
	location: "",
	startDate: new Date(),
	endDate: new Date(),
	isActive: true,
};
function ModalForm(props: IModalForm) {
	const { onClose, open, mutate } = props;
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState(initForm);
	const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData((old) => ({
			...old,
			[e.target.name]: e.target.value,
		}));
	};
	const onSuccess = () => {
		mutate("/events/getall");
		setFormData(initForm);
		setTimeout(onClose, 1000);
	};
	const handleSave = () => {
		API.handlePost<IEvent>(formData, onSuccess, dispatch, "events");
	};
	return (
		<Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
			<DialogTitle className="bg-slate-900 text-white">New Event</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="eventName"
							value={formData.eventName}
							label="Nama Event"
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="eventTheme"
							label="Tema"
							value={formData.eventTheme}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="organizer"
							label="Organizer"
							value={formData.organizer}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							margin="dense"
							variant="standard"
							name="location"
							label="Lokasi"
							value={formData.location}
							onChange={handleInputText}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<DateTimePicker
							value={formData.startDate}
							label="Start date"
							onChange={(date) => setFormData((old) => ({ ...old, startDate: formatDate(date!) }))}
							renderInput={(params) => <TextField margin="dense" fullWidth variant="standard" {...params} />}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<DateTimePicker
							value={formData.endDate}
							label="End Date"
							onChange={(date) => setFormData((old) => ({ ...old, endDate: formatDate(date!) }))}
							renderInput={(params) => <TextField variant="standard" margin="dense" fullWidth {...params} />}
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
}

export const getStaticProps: GetStaticProps = async () => {
	const data: IEvent[] = await axios.get(BASE_URL + "/events/getall").then((res) => res.data);

	return {
		props: {
			fallback: {
				"/events/getall": data,
			},
		},
	};
};
