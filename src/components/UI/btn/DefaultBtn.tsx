import { FC, ReactNode, KeyboardEvent } from "react";
import classes from "./DefaultBtn.module.scss";
import cn from "classnames";

interface IProps {
	children: ReactNode;
	classMode?: "main" | "clear" | "main-simple" | "decline";
	type?: "button" | "submit" | "reset";
	onClickHandler?: () => void;
	disabled?: boolean;
	title?: string;
	className?: string;
	onKeyDown?: (e: KeyboardEvent) => void;
}

const DefaultBtn: FC<IProps> = ({
	disabled,
	children,
	classMode,
	onClickHandler,
	type = "button",
	title,
	className = "",
	onKeyDown,
}) => {
	const classNames = cn(
		classes.btnDefault,
		className,
		classMode === "main" && classes.main,
		classMode === "clear" && classes.clear,
		classMode === "decline" && classes.decline,
		classMode === "main-simple" && classes["main-simple"]
	);

	return (
		<button
			type={type}
			className={classNames}
			onClick={onClickHandler}
			disabled={disabled}
			title={title}
			onKeyDown={onKeyDown}
		>
			{children}
		</button>
	);
};

export default DefaultBtn;
