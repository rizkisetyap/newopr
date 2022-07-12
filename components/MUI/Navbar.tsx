import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch } from "app/hooks";
import { openDrawer } from "app/reducers/uiReducer";
import { Container } from "@mui/system";
import { AccountCircle, LogoutRounded } from "@mui/icons-material";
import { logout } from "app/reducers/authReducer";
import { signOut, useSession } from "next-auth/react";

const MuiNavbar = () => {
	const dispatch = useAppDispatch();
	const { data: session } = useSession({ required: true });
	const handleLogout = () => {
		signOut({
			redirect: true,
			callbackUrl: "/newopr/",
		}).then(() => dispatch(logout()));
	};
	return (
		<Box className="bg-slate-700 text-white">
			<Container maxWidth="xl" component="header" className="py-2">
				<Box className="flex items-center">
					<div className="inline-flex flex-1 gap-0 items-center">
						<Typography className="font-bold">MY OPR</Typography>
						<Tooltip title="Menu">
							<IconButton onClick={() => dispatch(openDrawer())} edge="start" color="inherit" sx={{ ml: 2 }}>
								<MenuIcon />
							</IconButton>
						</Tooltip>
					</div>
					{session?.user && (
						<div className="inline-flex items-center">
							<IconButton
								className="text-right text-white"
								color="inherit"
								onClick={handleLogout}
								aria-label="Logout"
							>
								<AccountCircle />
								<Typography className="ml-2" variant="body2">
									{session.user.firstName + " " + session.user.lastName}
								</Typography>
							</IconButton>
							<Tooltip title="Log out" placement="top">
								<IconButton className="text-white" aria-label="log out" onClick={handleLogout}>
									<LogoutRounded className="text-white" />
								</IconButton>
							</Tooltip>
						</div>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default MuiNavbar;
