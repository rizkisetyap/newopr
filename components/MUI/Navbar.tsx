import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { openDrawer } from "app/reducers/uiReducer";
import { Container } from "@mui/system";

const MuiNavbar = () => {
	const dispatch = useAppDispatch();
	return (
		<Box className="bg-slate-700 text-white">
			<Container maxWidth="xl" component="header" className="py-2">
				<Box className="flex items-center">
					<div className="inline-flex gap-0 items-center">
						<Typography className="font-bold">MY OPR</Typography>
						<Tooltip title="Menu">
							<IconButton onClick={() => dispatch(openDrawer())} edge="start" color="inherit" sx={{ ml: 2 }}>
								<MenuIcon />
							</IconButton>
						</Tooltip>
					</div>
				</Box>
			</Container>
			{/* <AppBar elevation={0} position="static">
				<Toolbar>
				</Toolbar>
			</AppBar> */}
		</Box>
	);
};

export default MuiNavbar;
