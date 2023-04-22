import { ChangeEvent, FC, DragEvent, Dispatch, SetStateAction } from "react";
import classes from "./UploadModal.module.scss";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import Image from "next/image";
import { RiMovieLine, RiFile2Line, RiCloseFill } from "react-icons/ri";
import ModalWrapper from "../modal/ModalWrapper";
import cn from "classnames";

interface IProps {
	files: File[];
	setFiles: Dispatch<SetStateAction<File[]>>;
	setIsShowUpload: Dispatch<SetStateAction<boolean>>;
	onlyImage?: boolean;
}

const UploadModal: FC<IProps> = ({ files, setFiles, setIsShowUpload, onlyImage = false }) => {
	const imagesChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const fileList = e.target.files;
			const filesArray = Array.from(fileList);
			if (filesArray.some((file) => Array.from(files).some((f) => f.name === file.name))) return;

			setFiles((prev) => [...prev, ...filesArray]);
		}
	};

	const onDropHandler = (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const fileList = e.dataTransfer.files;
			const filesArray = Array.from(fileList);
			if (filesArray.some((file) => Array.from(files).some((f) => f.name === file.name))) return;

			setFiles((prev) => [...prev, ...filesArray]);
		}
	};

	const deleteFile = (fileName: string) => {
		const filter = files.filter((file) => file.name !== fileName);
		setFiles(filter);
	};

	return (
		<ModalWrapper onClickHandler={() => setIsShowUpload(false)}>
			<div className={classes.wrapper}>
				<h4>Upload files (Max 4 files and file size max 2 MB.)</h4>
				<label onDrop={onDropHandler} onDragOver={(e) => e.preventDefault()}>
					<BsFillCloudArrowUpFill className={classes.fileIco} />
					<input
						multiple={true}
						accept={onlyImage ? "image/*" : "*/*"}
						type="file"
						name="upload file"
						onChange={(e) => imagesChange(e)}
					/>
				</label>
				{!!files.length && (
					<ul>
						{files.map((file) => (
							<li
								className={cn(file.size > 2000000 && classes.valid)}
								key={file.name}
								title={
									file.size > 2000000
										? "The file will not be sent because the allowed size is 2 MB"
										: ""
								}
							>
								<div className={classes.preview}>
									{file.type.includes("video") ? (
										<RiMovieLine />
									) : file.type.includes("image") ? (
										<Image
											src={URL.createObjectURL(file)}
											alt="upload files preview"
											width={100}
											height={100}
										/>
									) : (
										<RiFile2Line />
									)}
									<span className={classes.fileName}>{file.name}</span>
								</div>
								<button className={classes.deleteBtn} onClick={() => deleteFile(file.name)}>
									<RiCloseFill />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</ModalWrapper>
	);
};

export default UploadModal;
