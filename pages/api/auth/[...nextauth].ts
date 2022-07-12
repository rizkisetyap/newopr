import { User } from "app/reducers/authReducer";
import axios from "axios";
import { BASE_URL } from "lib/constants";
import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				npp: { label: "NPP", type: "text" },
				password: { label: "Password", type: "text" },
			},
			async authorize(credentials, req) {
				const npp = credentials?.npp;
				const password = credentials?.password;
				const user = await axios.post(BASE_URL + "/login", { npp, password }).then((res) => res.data);

				// console.log(user);
				if (!user) {
					return null;
				}
				return user;
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	// jwt: {
	// 	secret: "dmjbxppvzefqxaloewtjuoknqqdsumlh",
	// },
	callbacks: {
		jwt: async ({ token, user, account }) => {
			if (user) {
				token.accessToken = user!.idToken;
				token.user = user.userInfo;
			}
			return token;
		},
		session: async ({ session, token }) => {
			session.accessToken = token.accessToken;
			session.user = token.user as User;
			return session;
		},
		redirect: async ({ baseUrl, url }) => {
			baseUrl += "/newopr";
			return url;
		},
	},

	pages: {
		signIn: process.env.NEXT_PUBLIC_BASE_URL,
		error: process.env.NEXT_PUBLIC_BASE_URL + "/",
	},
	debug: process.env.NODE_ENV === "development",
});
