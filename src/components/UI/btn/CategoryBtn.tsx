import cn from "classnames";
import { FC, MouseEvent, ReactNode, memo } from "react";
import classes from "./CategoryBtn.module.scss";

interface IProps {
	onClickHandler: () => void;
	isActive?: boolean;
	children: ReactNode;
}

const CategoryBtn: FC<IProps> = ({ onClickHandler, isActive = false, children }) => {
	const onClickHandlerMain = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (onClickHandler) onClickHandler();
	};
	return (
		<button
			className={cn(classes.btn, isActive && classes.active)}
			onClick={(e) => onClickHandlerMain(e)}
		>
			{children}
		</button>
	);
};

export default CategoryBtn;
