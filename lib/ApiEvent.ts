import { setLoading } from "app/reducers/actionReducer";
import { closeModal, openSnackbar } from "app/reducers/uiReducer";
import { AppDispatch } from "app/store";
import axios from "axios";
import { BASE_URL } from "./constants";

export const handleDeleteEvent = async (
  queryId: string,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.delete(BASE_URL + "/events/delete?id=" + queryId);
    const data = res.data;
    if (data > 0) {
      dispatch(
        openSnackbar({
          message: "Data berhasil dihapus",
          severity: "success",
        })
      );
      dispatch(setLoading(false));
    } else {
      openSnackbar({
        message: "Data gagal dihapus",
        severity: "error",
      });
    }
  } catch (error) {
    dispatch(
      openSnackbar({
        message: (error as any).response.message,
        severity: "error",
      })
    );
  }
  dispatch(setLoading(false));
};
type Data = {
  [key: string]: any;
};
export const handlePostEvent = async (
  formData: Data,
  onSuccess: () => void,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post(BASE_URL + "/events", formData);
    const data = res.data;

    if (data > 0) {
      onSuccess();
      dispatch(closeModal());
      dispatch(
        openSnackbar({
          message: "Sukses menambahkan data",
          severity: "success",
        })
      );
    } else {
      openSnackbar({ message: "Gagal menambahkan data", severity: "error" });
    }
    dispatch(setLoading(false));
  } catch (error) {
    openSnackbar({
      message: (error as any).response.message,
      severity: "error",
    });
  }
  dispatch(setLoading(false));
};

export const handleUpdateEvent = async (
  formData: Data,
  onSuccess: () => void,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.put(BASE_URL + "/events", formData);
    const data = res.data;

    if (data > 0) {
      onSuccess();
      dispatch(closeModal());
      dispatch(
        openSnackbar({
          message: "Sukses Update data",
          severity: "success",
        })
      );
    } else {
      openSnackbar({ message: "Gagal Update data", severity: "error" });
    }
    dispatch(setLoading(false));
  } catch (error) {
    openSnackbar({
      message: (error as any).response.message,
      severity: "error",
    });
  }
  dispatch(setLoading(false));
};
