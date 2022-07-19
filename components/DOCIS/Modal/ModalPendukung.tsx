import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	ListItem,
	ListItemButton,
	TextField,
	Typography,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import SaveButton from "components/Button/SaveButton";
import DialogActionButton from "components/DialogButton/SaveButton";
import FileInput from "components/Input/FileInput";
import API, { FILE } from "lib/ApiCrud";
import { BASE_URL } from "lib/constants";
import { useSession } from "next-auth/react";
import { IDokumenPendukung } from "pages/documentISO";
import React, { ChangeEvent, useRef, useState } from "react";
import { useSWRConfig } from "swr";

interface Props {
	open: boolean;
	onClose: () => void;
	doc: IDokumenPendukung;
}
const ModalPendukung = (props: Props) => {
	const { data: session } = useSession();
	const [name, setName] = useState(props.doc.fileName);
	const { mutate } = useSWRConfig();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const dispatch = useAppDispatch();
	const [isoFile, setIsoFile] = useState<FILE | null>(null);
	const download = () => {
		window.location.href = BASE_URL.replace("/api", "/") + props.doc.filePath;
	};
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target?.files?.item(0);
		const fr = new FileReader();

		if (files !== null || files !== undefined) {
			fr.onloadend = (result) => {
				const base64 = result.target?.result;
				setIsoFile((file) => ({
					...file,
					base64str: base64?.toString(),
					extension: files!.name.match(/[^\\]*\.(\w+)$/)![1],
					name: files!.name,
					type: files!.type,
				}));
			};
		}

		if (files) {
			fr.readAsDataURL(files);
		}
	};
	const onSuccess = () => {
		mutate("/DocumentIso/DokumenPendukung?GroupId=" + session?.user.employee.service?.groupId);
		fileInputRef.current!.value = "";
	};
	const handleUpdate = () => {
		const data = {
			fileName: name,
			document: isoFile,
		};

		API.handleUpdate<any>(data, onSuccess, dispatch, "DocumentIso/edit/" + props.doc.id);
	};
	return (
		<Dialog maxWidth="md" fullWidth open={props.open} onClose={props.onClose}>
			<DialogTitle className="bg-slate-900 text-white">Update Dokumen</DialogTitle>
			<DialogContent className="my-6">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							variant="standard"
							margin="dense"
							name="name"
							label="Nama"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<div className="py-4 space-y-2">
						<Typography>Dokumen sebelumnya</Typography>
						<Chip label={props.doc.fileName} size="small" variant="outlined" onClick={download} />
					</div>
					<FileInput ref={fileInputRef} acccept="application/pdf" onChange={handleFileChange} />
				</Grid>
			</DialogContent>
			<DialogActions className="bg-slate-900 text-white">
				<DialogActionButton onSave={handleUpdate} onCancel={props.onClose} />
			</DialogActions>
		</Dialog>
	);
};

export default ModalPendukung;
