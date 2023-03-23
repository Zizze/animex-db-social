import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { ITrailerJikan } from "@Store/animeJikan/IAnime.interface";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";
import classes from "./Trailer.module.scss";

interface IProps {
	trailer: ITrailerJikan;
	setActiveTrailer: Dispatch<SetStateAction<boolean>>;
}

const Trailer: FC<IProps> = ({ trailer, setActiveTrailer }) => {
	const playerRef = useRef<YouTubePlayer>(null);

	const opts: YouTubeProps["opts"] = {
		height: "100%",
		width: "100%",
		playerVars: {
			autoplay: 0,
			rel: 0,
		},
	};

	return (
		<ModalWrapper onClickHandler={() => setActiveTrailer(false)}>
			<YouTube
				className={classes.youtube}
				videoId={trailer.youtube_id}
				opts={opts}
				ref={playerRef}
			/>
		</ModalWrapper>
	);
};

export default Trailer;
