import React, { ChangeEvent } from "react";

interface Props {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	acccept?: string;
}
const FileInput = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
	return (
		<label className="block text-lg cursor-pointer bg-violet-50 rounded-full overflow-hidden">
			<span className="sr-only bg-violet-300">Choose File</span>
			<input
				accept={props.acccept}
				ref={ref}
				onChange={props.onChange}
				type="file"
				className="block bg-rose-50 w-full text-base hover:cursor-pointer text-gray-600 file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-base file:font-bold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
			/>
		</label>
	);
});
FileInput.defaultProps = {
	acccept: "*",
};

export default FileInput;
