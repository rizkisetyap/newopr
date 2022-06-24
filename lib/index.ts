import axios from "axios";
import { BASE_URL } from "./constants";

export const fetcher = (key: string) => axios.get(BASE_URL + key).then((res) => res.data);
