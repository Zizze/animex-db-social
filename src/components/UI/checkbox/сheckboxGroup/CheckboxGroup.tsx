import Checkbox from "../Checkbox";
import { FC } from "react";
import classes from "./CheckboxGroup.module.scss";
import cn from "classnames";

type CheckboxProps = {
	options: string[];
	selectedOption: string | boolean;
	onChangeHandler: (name: string) => void;
	title?: string;
	classname?: string;
};

const CheckboxGroup: FC<CheckboxProps> = ({
	options,
	selectedOption,
	onChangeHandler,
	title,
	classname,
}) => (
	<div className={cn(classes.checkboxBlock, classname && classname)}>
		{title && <p>{title}</p>}
		<ul className={classes.checkboxList}>
			{options.map((option) => (
				<Checkbox
					onlyOneMode={true}
					name={option}
					id={option}
					onChangeHandler={onChangeHandler}
					disabled={option === selectedOption}
					key={option}
				/>
			))}
		</ul>
	</div>
);

export default CheckboxGroup;
