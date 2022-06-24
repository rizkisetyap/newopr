import { setLoading } from "app/reducers/actionReducer";
import { closeModal, openSnackbar } from "app/reducers/uiReducer";
import { AppDispatch } from "app/store";
import axios from "axios";
import { ILocation } from "types/ModelInterface";
import { BASE_URL } from "./constants";
const url = BASE_URL + "/officelocation";

export const handleDeleteLocation = async (
  loc: ILocation,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await fetch(url, {
      method: "delete",
      body: JSON.stringify(loc),
    });
    // const res = await axios.delete(url, { bo: loc });
    const data = await res.json();
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
export const handlePostLocation = async (
  formData: Data,
  onSuccess: () => void,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post(url, formData);
    const data = res.data;
    console.log(data);

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

export const handleUpdateLocation = async (
  formData: Data,
  onSuccess: () => void,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.put(url, formData);
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
      message: "delete failed",
      severity: "error",
    });
  }
  dispatch(setLoading(false));
};
