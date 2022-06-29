import { formatISO } from "date-fns";
import moment from "moment";
const dev = process.env.NODE_ENV !== "production";

// export const BASE_URL = "http://103.101.225.233/devmyopr/api";
export const BASE_URL = dev ? "http://localhost:5211/api" : "http://103.101.225.233/devmyopr/api";

type DateF = string | Date;
export function formatDate(date: DateF) {
	return moment(date).format("YYYY-MM-DDThh:mm");
}
