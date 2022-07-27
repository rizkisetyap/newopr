import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { SessionProvider } from "next-auth/react";
import { NextComponentType } from "next";
import { CssBaseline } from "@mui/material";

type CustomComponent = NextComponentType & {
	auth: boolean;
};
interface CustomApprops extends AppProps {
	Component: CustomComponent;
}

function MyApp({ Component, pageProps }: CustomApprops) {
	return (
		<SessionProvider session={pageProps.session} basePath="/newopr/api/auth">
			<Provider store={store}>
				<CssBaseline />
				<Component {...pageProps} />
			</Provider>
		</SessionProvider>
	);
}

export default MyApp;
