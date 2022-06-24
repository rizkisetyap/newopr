import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	SwipeableDrawer,
	Tooltip,
	Typography,
} from "@mui/material";
// * Menu Icon
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
// *
import { useAppDispatch, useAppSelector } from "app/hooks";
import { closeDrawer, openDrawer } from "app/reducers/uiReducer";
import MuiNavbar from "components/MUI/Navbar";
import { FC, ReactNode } from "react";
import LinkItem from "components/MUI/LinkItem";
import Head from "next/head";

import { ChevronRight, ExpandMore } from "@mui/icons-material";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
interface IProps {
	children: ReactNode;
	title: string;
}

const AdminLayout: FC<IProps> = ({ children, title }) => {
	const open = useAppSelector((state) => state.ui.sidebar.open);
	const dispatch = useAppDispatch();

	return (
		<div className="overflow-x-hidden bg-violet-100">
			<Head>
				<title>{title}| MyOPR</title>
			</Head>
			<div className="min-h-screen w-screen overflow-x-hidden">
				<MuiNavbar />
				<div className="h-full min-h-full">{children}</div>
			</div>
			<SwipeableDrawer
				anchor="left"
				ModalProps={{ keepMounted: true }}
				open={open}
				onClose={() => dispatch(closeDrawer())}
				onOpen={() => dispatch(openDrawer())}
			>
				<Box width={{ xs: "80vw", md: "25vw" }}>
					<List>
						<ListItem>
							<ListItemText>
								<Typography variant="h6">Menu</Typography>
							</ListItemText>
							<Tooltip title="Close">
								<IconButton onClick={() => dispatch(closeDrawer())} size="small">
									<CloseRoundedIcon />
								</IconButton>
							</Tooltip>
						</ListItem>
						{/* dashboard */}

						<LinkItem Icon={<DashboardIcon />} text="Dasboard" href="/admin" />
						<Accordion elevation={0}>
							<AccordionSummary
								expandIcon={<ExpandMore />}
								aria-controls="panel-content"
								id="panel-header"
								className="m-0 bg-gray-100"
								sx={{
									m: 0,
								}}
							>
								<Typography className="text-base font-medium" variant="h6">
									Master Account
								</Typography>
							</AccordionSummary>
							<AccordionDetails
								sx={{
									px: 0,
									pb: 0,
								}}
							>
								<LinkItem Icon={<PersonAddAltRoundedIcon />} text="User Account" href="/admin/account" />
								<LinkItem Icon={<GroupsIcon />} text="Group" href="/admin/group" />
								<LinkItem Icon={<WorkspacesRoundedIcon />} text="Posisi" href="/admin/position" />
							</AccordionDetails>
						</Accordion>
						<Accordion elevation={0}>
							<AccordionSummary
								expandIcon={<ExpandMore />}
								aria-controls="panel-content"
								id="panel-header"
								className="m-0 bg-gray-100"
								sx={{
									m: 0,
								}}
							>
								<Typography className="text-base font-medium" variant="h6">
									Master Data
								</Typography>
							</AccordionSummary>
							<AccordionDetails
								sx={{
									px: 0,
									pb: 0,
								}}
							>
								{/*  */}
								<LinkItem Icon={<EventAvailableIcon />} text="Event" href="/admin/event" />
								<LinkItem Icon={<CategoryIcon />} text="Kategori Konten" href="category" />
								<LinkItem Icon={<ArticleIcon />} text="Konten" href="/admin/content" />
								<LinkItem Icon={<SlideshowIcon />} text="Slider" href="/admin/slider" />

								<LinkItem Icon={<AddLocationAltRoundedIcon />} text="Office Location" href="/admin/location" />
								<LinkItem
									Icon={<CircleRoundedIcon className="h-5 w-5" />}
									text="Zoom Status"
									href="/admin/masterzoom"
								/>
								<LinkItem
									Icon={<CircleRoundedIcon className="h-5 w-5" />}
									text="Zoom"
									href="/admin/masterzoom"
								/>
							</AccordionDetails>
						</Accordion>
						<Accordion elevation={0}>
							<AccordionSummary
								expandIcon={<ExpandMore />}
								aria-controls="panel-content"
								id="panel-header"
								className="m-0 bg-gray-100"
								sx={{
									m: 0,
								}}
							>
								<Typography className="text-base font-medium" variant="h6">
									Transaksi
								</Typography>
							</AccordionSummary>
							<AccordionDetails
								sx={{
									px: 0,
									pb: 0,
								}}
							>
								<LinkItem
									Icon={<VideocamRoundedIcon className="h-5 w-5" />}
									text="Zoom Scheduler"
									href="/admin/zoomby"
								/>
								<LinkItem
									Icon={<InsertDriveFileRoundedIcon className="h-5 w-5" />}
									text="Document ISO"
									href="/admin/documentISO"
								/>
							</AccordionDetails>
						</Accordion>
					</List>
				</Box>
			</SwipeableDrawer>
		</div>
	);
};

export default AdminLayout;
