import { FC, MouseEvent, ReactNode, useRef } from "react";
import classes from "./ModalWrapper.module.scss";

interface IProps {
	children: ReactNode;
	onClickHandler?: () => void;
	styles?: {};
}

const ModalWrapper: FC<IProps> = ({ children, onClickHandler, styles }) => {
	const ref = useRef(null);

	const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === ref.current) {
			onClickHandler?.();
		}
	};

	return (
		<div className={classes.wrapper} style={styles} ref={ref} onMouseDown={(e) => clickHandler(e)}>
			{children}
		</div>
	);
};

export default ModalWrapper;
