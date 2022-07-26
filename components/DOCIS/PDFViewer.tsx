import { Dialog, DialogTitle, Typography, DialogContent, DialogActions, Button } from "@mui/material";
import { BASE_URL } from "lib/constants";
import { useState } from "react";
import { Page, Document, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export interface IPdfViewer {
	open: boolean;
	onClose: () => void;
	doc: {
		filePath: string;
		fileName: string;
	};
}
export const PDfViewer = (props: IPdfViewer) => {
	// pdf view
	const [documentPage, setDocumentPage] = useState(1);
	const [numPageDoc, setNumPageDoc] = useState<number | null>(null);
	const onLoadDocSuccess = ({ numPages }: any) => {
		setNumPageDoc(numPages);
	};
	const endocedUri = BASE_URL.replace("api", "") + props.doc.filePath;
	return (
		<Dialog maxWidth="lg" fullWidth open={props.open} onClose={props.onClose}>
			<DialogTitle>
				<Typography className="border-b-2 border-spacing-2 border-b-orange-600 font-bold" component="p">
					{props.doc.fileName}
				</Typography>
			</DialogTitle>
			<DialogContent className="mx-auto">
				<Document file={endocedUri} onLoadSuccess={onLoadDocSuccess}>
					{[...new Array(numPageDoc).fill(1)].map((el, i) => (
						<Page key={i + 1} pageNumber={i + 1} />
					))}
				</Document>
			</DialogContent>
			<DialogActions>
				<Button color="warning" className="bg-orange-600" onClick={props.onClose} variant="contained">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
