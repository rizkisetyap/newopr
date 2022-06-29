import axios from "axios";
import useSWR, { SWRResponse } from "swr";
import { BASE_URL } from "lib/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const fetcher = (path: string) => axios.get(BASE_URL + path).then((res) => res.data);

// const API = ()

export const useFetch = <T>(path: string): SWRResponse<T, any> => {
	const res = useSWR(path, fetcher);

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
