import { ChangeEvent, FC, useState, useEffect, useCallback } from "react";
import classes from "./Checkbox.module.scss";
import cn from "classnames";

interface IProps {
	name: string;
	onChangeHandler: (checkboxName: string) => void;
	id: number | string;
	clear?: string;
	classnames?: string;
	onlyOneMode?: boolean;
	disabled?: boolean;
}

const Checkbox: FC<IProps> = ({
	name,
	onChangeHandler,
	id,
	clear,
	classnames,
	onlyOneMode,
	disabled,
}) => {
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (clear === "clear") setChecked(false);
	}, [clear]);

	const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setChecked((prev) => !prev);
		onChangeHandler(e.currentTarget.value);
	};

	const changeHandlerOnlyOne = (e: ChangeEvent<HTMLInputElement>) => {
		onChangeHandler(e.currentTarget.value);
	};

	return (
		<>
			{!onlyOneMode ? (
				<div className={cn(classes.wrapper, classnames)}>
					<input
						type="checkbox"
						checked={checked}
						value={id}
						id={`${id}`}
						onChange={changeHandler}
					/>
					<label htmlFor={`${id}`}>{name}</label>
				</div>
			) : (
				<div className={cn(classes.wrapper, classnames)}>
					<input
						type="checkbox"
						checked={disabled}
						value={id}
						id={`${id}`}
						onChange={changeHandlerOnlyOne}
					/>
					<label htmlFor={`${id}`}>{name.replace("_", "")}</label>
				</div>
			)}
		</>
	);
};

export default Checkbox;
