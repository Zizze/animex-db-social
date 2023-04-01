import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import { FC, useState } from "react";
import classes from "./RightDetails.module.scss";
import { FaArrowDown } from "react-icons/fa";
import cn from "classnames";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Trailer from "./trailer/Trailer";

interface IProps {
	anime: IDataAnime;
}

const RightDetails: FC<IProps> = ({ anime }) => {
	const [activeBackground, setActiveBackground] = useState(false);
	const [activeTrailer, setActiveTrailer] = useState(false);

	const {
		rank,
		score: rate,
		scored_by: rateBy,
		popularity,
		synopsis: description,
		background,
		trailer,
	} = anime;

	return (
		<div className={classes.right}>
			<ul className={classes.head}>
				{rank && (
					<li>
						Rank: <span>{rank}</span>
					</li>
				)}
				{rate && (
					<li className={classes.rateblock}>
						<span className={classes.rate}>
							Rate: <span>{rate}</span>
						</span>
						<span className={classes.rateBy}>
							Rate by: <span>{rateBy}</span>
						</span>
					</li>
				)}
				<li>
					Popularity: <span>{popularity}</span>
				</li>
			</ul>
			{description && (
				<div className={classes.descr}>
					<div className={classes.title}>
						<span>Synopsis</span>
						<FaArrowDown />
					</div>
					<p>{description}</p>
				</div>
			)}

			<div className={classes.backWrapper}>
				<div className={classes.btns}>
					{background && (
						<button
							onClick={() => setActiveBackground((prev) => !prev)}
							className={cn(classes.back, activeBackground && classes.active)}
						>
							Background
						</button>
					)}
					{trailer.youtube_id && (
						<DefaultBtn
							className={classes.trailer}
							classMode="main-simple"
							onClickHandler={() => setActiveTrailer(true)}
						>
							Trailer
						</DefaultBtn>
					)}
				</div>
				<div className={classes.wrapper}>
					<p className={cn(activeBackground && classes.active)}>{background}</p>
				</div>
			</div>
			{activeTrailer && <Trailer trailer={trailer} setActiveTrailer={setActiveTrailer} />}
		</div>
	);
};

export default RightDetails;
