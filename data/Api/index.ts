import axios from "axios";
import useSWR, { SWRResponse } from "swr";
import { BASE_URL } from "lib/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IUnit } from "types/ModelInterface";
// import Cookies from "js-cookie";
// export const cookie = Cookies.get("next-auth.session-token");
// const AxiosAPI = axios.create({
// 	baseURL: BASE_URL,
// 	headers: {
// 		"Content-Type": "application/json",
// 		Authorization: "Bearer " + cookie,
// 	},
// });

// console.log(cookie);

export const fetcher = (path: string) => axios.get(BASE_URL + path).then((res) => res.data);

// const API = ()

export const useFetch = <T>(path: string): SWRResponse<T, any> => {
	const res = useSWR(path, fetcher, {
		revalidateIfStale: true,
		revalidateOnFocus: true,
		refreshInterval: 3000,
	});

	return res;
};
export const useQuery = <T>(path: string, id: string | number | undefined) => {
	const [data, setData] = useState<T | null>(null);
	useEffect(() => {
		const getData = async () => {
			const res = await axios.get(BASE_URL + "/" + path + "/by?id=" + id).then((res) => res.data);
			// const d = res.data;
			setData(res);
		};
		if (id) {
			getData();
		}
	}, [id, path]);

	return data;
};
export const useFetchById = <T>(path: string): SWRResponse<T, any> => {
	const router = useRouter();
	const { id } = router.query;
	const res = useSWR(path + "/" + id, fetcher, { refreshInterval: 1 });
	return res;
};

const unitQueryFetcher = (query: string) => axios.get(BASE_URL + "/unit/?" + query).then((res) => res.data);
export const useUnitQuery = (query: string): SWRResponse<IUnit[], any> => {
	return useSWR(query, unitQueryFetcher);
};

// export const useFetchById = <T>(path: string, deeps: any): T | undefined => {
//   const router = useRouter();
//   const id = router.query.id;
//   const [data, setData] = useState<T>();
//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     if (router.asPath !== router.route) {
//       axios
//         .get(BASE_URL + path + "/" + id)
//         .then((res) => {
//           setData(res.data as T);
//         })
//         .catch((err) => {
//           dispatch(
//             openSnackbar({
//               severity: "error",
//               message: "Gagal memuat Data",
//             })
//           );
//         });
//     }
//   }, [router, deeps]);

//   return data;
// };
