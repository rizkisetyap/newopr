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
import React, { FC, ReactNode, useEffect, useState } from "react";
import LinkItem from "components/MUI/LinkItem";
import Head from "next/head";

import { AdminPanelSettingsRounded, ChevronRight, ExpandMore } from "@mui/icons-material";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { useSession } from "next-auth/react";
interface IProps {
	children: ReactNode;
	title: string;
}

const AdminLayout: FC<IProps> = ({ children, title }) => {
	const open = useAppSelector((state) => state.ui.sidebar.open);
	const { data: session } = useSession();
	const dispatch = useAppDispatch();
	const isAdmin = session?.user.accountRole.includes("Admin");

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
						{/* Admin Menu */}
						<LinkItem Icon={<DashboardIcon />} text="Dasboard" href="/dashboard" />
						{isAdmin && (
							<React.Fragment>
								<LinkItem Icon={<AdminPanelSettingsRounded />} text="Administrator" href="/admin" />

								<LinkItem Icon={<PersonAddAltRoundedIcon />} text="User Account" href="/admin/account" />
								<LinkItem Icon={<GroupsIcon />} text="Group" href="/admin/group" />
								<LinkItem Icon={<WorkspacesRoundedIcon />} text="Posisi" href="/admin/position" />

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
									text="Layanan"
									href="/admin/services"
								/>
								<LinkItem
									Icon={<CircleRoundedIcon className="h-5 w-5" />}
									text="Zoom"
									href="/admin/masterzoom"
								/>

								<LinkItem
									Icon={<VideocamRoundedIcon className="h-5 w-5" />}
									text="Zoom Scheduler"
									href="/admin/zoomby"
								/>
							</React.Fragment>
						)}
						<LinkItem
							Icon={<InsertDriveFileRoundedIcon className="h-5 w-5" />}
							text="Document ISO"
							href="/documentISO"
						/>
					</List>
				</Box>
			</SwipeableDrawer>
		</div>
	);
};

export default AdminLayout;
