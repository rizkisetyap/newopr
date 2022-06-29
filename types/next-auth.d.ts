import Nextauth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			accountRole: string[];
			firstName: string;
			lastName: string;
			npp: string;
			jabatan: string;
			kelompok: string;
			service: string;
		};
	}
}
