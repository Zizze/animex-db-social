import {
	ChangeEvent,
	Dispatch,
	FC,
	FormEvent,
	KeyboardEvent,
	SetStateAction,
	useRef,
	useState,
	ReactNode,
} from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { FiSmile, FiSend } from "react-icons/fi";
import styles from "./TextAreaForm.module.scss";
import cn from "classnames";
import { AiOutlineLink } from "react-icons/ai";
import UploadModal from "../uploadModal/UploadModal";

interface IProps {
	text: string;
	setText: Dispatch<SetStateAction<string>>;
	onSubmitHandler: (e: FormEvent) => void;
	classes?: classnames;
	placeholder: string;
	maxRows?: number;
	minRows?: number;
	onEnter?: boolean;
	children?: ReactNode;
	minLenght?: number;
	uploadFisible?: boolean;
	files?: File[];
	setFiles?: Dispatch<SetStateAction<File[]>>;
}
interface classnames {
	cnForm: string;
	cnTextArea?: string;
	cnBtns?: string;
	cnBtnSmile?: string;
	cnBtnSent?: string;
	cnEmoji?: string;
}

const TextAreaForm: FC<IProps> = ({
	text,
	setText,
	onSubmitHandler,
	classes,
	placeholder,
	maxRows = 5,
	minRows = 1,
	onEnter = true,
	children,
	minLenght = 0,
	uploadFisible = false,
	files,
	setFiles,
}) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [pressEnter, setPressEnter] = useState<boolean>(false);
	const [isOpenSmiles, setIsOpenSmiles] = useState<boolean>(false);
	const [messErr, setMessErr] = useState<string | boolean>(false);
	const [isShowUpload, setIsShowUpload] = useState(false);

	const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (pressEnter) return;
		setText(e.target.value);

		if (minLenght > 0) {
			const minLenghtCheck =
				e.target.value.trim().length < minLenght && `Minimum field length ${minLenght} characters.`;
			setMessErr(minLenghtCheck);
		}
	};

	const onPressEnter = (e: KeyboardEvent) => {
		if (onEnter) {
			if (e.key === "Enter" && !e.shiftKey) {
				setPressEnter(true);
				formRef.current?.requestSubmit();
			} else {
				setPressEnter(false);
			}
		}
	};

	const onEmojiClick = (emojiData: any) => {
		setText((prev) => prev + emojiData.native);
		setIsOpenSmiles(false);
	};

	const checkedClass = {
		cnForm: cn(styles.textForm, classes?.cnForm),
		cnTextarea: cn(styles.textArea, classes?.cnTextArea),
		cnBtns: cn(styles.btns, classes?.cnBtns),
		cnBtnSmile: cn(styles.smiles, classes?.cnBtnSmile),
		cnBtnSent: cn(styles.sent, classes?.cnBtnSent),
		cnEmoji: cn(styles.emoji, classes?.cnEmoji),
	};

	return (
		<>
			<form onSubmit={onSubmitHandler} ref={formRef} className={checkedClass.cnForm}>
				{children}
				<div className={styles.textAreaWrapper}>
					{messErr && <p className={styles.textField}>{messErr}</p>}
					<ReactTextareaAutosize
						className={cn(checkedClass.cnTextarea, uploadFisible && styles.upload)}
						value={text}
						onChange={(e) => onChangeText(e)}
						placeholder={placeholder}
						maxRows={maxRows}
						minRows={minRows}
						onKeyDown={onPressEnter}
					/>
					<div className={checkedClass.cnBtns}>
						{uploadFisible && (
							<button
								className={checkedClass.cnBtnSmile}
								type="button"
								title="Smiles"
								onClick={() => setIsShowUpload(true)}
							>
								<AiOutlineLink />
							</button>
						)}
						<button
							className={checkedClass.cnBtnSmile}
							type="button"
							title="Smiles"
							onClick={() => setIsOpenSmiles((prev) => !prev)}
						>
							<FiSmile />
						</button>
						<button className={checkedClass.cnBtnSent} type="submit" title="Sent message">
							<FiSend />
						</button>
					</div>
					{isOpenSmiles && (
						<div className={checkedClass.cnEmoji}>
							<EmojiPicker
								emojiSize={20}
								emojiButtonSize={30}
								dynamicWidth={true}
								data={data}
								onEmojiSelect={onEmojiClick}
								previewPosition="none"
							/>
						</div>
					)}
				</div>
			</form>
			{isShowUpload && files && setFiles && (
				<UploadModal setFiles={setFiles} files={files} setIsShowUpload={setIsShowUpload} />
			)}
		</>
	);
};

export default TextAreaForm;
