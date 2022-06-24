import { setLoading } from "app/reducers/actionReducer";
import { closeModal, openSnackbar } from "app/reducers/uiReducer";
import { AppDispatch } from "app/store";
import axios from "axios";
import { BASE_URL } from "./constants";

export const handleDeleteSlider = async (
  queryId: string,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.delete(BASE_URL + "/sliders/delete?id=" + queryId);
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
export const handlePostSlider = async (
  formData: Data,
  onSuccess: () => void,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post(BASE_URL + "/sliders/insert", formData);
    const data = res.data;

    if (data) {
      onSuccess();
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

export const handleUpdateSlider = async (
  formData: Data,
  onSuccess: () => void,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.put(BASE_URL + "/sliders/update", formData);
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
