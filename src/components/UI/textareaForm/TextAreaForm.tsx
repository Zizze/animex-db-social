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
}) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [pressEnter, setPressEnter] = useState<boolean>(false);
	const [isOpenSmiles, setIsOpenSmiles] = useState<boolean>(false);
	const [messErr, setMessErr] = useState<string | boolean>(false);

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
		<form onSubmit={onSubmitHandler} ref={formRef} className={checkedClass.cnForm}>
			{children}
			<div className={styles.textAreaWrapper}>
				{messErr && <p className={styles.textField}>{messErr}</p>}
				<ReactTextareaAutosize
					className={checkedClass.cnTextarea}
					value={text}
					onChange={(e) => onChangeText(e)}
					placeholder={placeholder}
					maxRows={maxRows}
					minRows={minRows}
					onKeyDown={onPressEnter}
				/>
				<div className={checkedClass.cnBtns}>
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
						<EmojiPicker data={data} onEmojiSelect={onEmojiClick} previewPosition="none" />
					</div>
				)}
			</div>
		</form>
	);
};

export default TextAreaForm;
