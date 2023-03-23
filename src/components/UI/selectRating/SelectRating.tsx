import { FC, SyntheticEvent } from "react";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import classes from "./SelectRating.module.scss";
import cn from "classnames";

interface IProps {
	classNames: string;
	onChangeRating: (event: SyntheticEvent<Element, Event>, value: number | null) => void;
	fontSize?: string;
	value?: number | null;
}

const StyledRating = styled(Rating)({
	"& .MuiRating-iconFilled": {
		color: "#7fdcde",
	},
	"& .MuiRating-iconHover": {
		color: "#7fdcde",
	},
	"& .MuiRating-iconEmpty": {
		color: "#7fdcde",
		opacity: "0.7",
	},
});

const SelectRating: FC<IProps> = ({ classNames, onChangeRating, fontSize, value }) => {
	const textCheck = value ? "i rated it" : "not rated";
	return (
		<div className={cn(classes.rating, classNames)}>
			<p className={classes.text}>{textCheck}</p>
			<StyledRating
				name="half-rating"
				style={{ fontSize: fontSize }}
				size="large"
				value={value || 0}
				precision={0.5}
				onChange={onChangeRating}
			/>
		</div>
	);
};

export default SelectRating;
