import Nextauth from "next-auth";
import { IEmploye } from "./ModelInterface";

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
			employee: IEmploye;
		};
	}
}
