import Image, { StaticImageData } from "next/image";
import { FC, useState } from "react";
import classes from "./BigImage.module.scss";
import defaultImage from "@Public/error.png";
import Loading from "@Components/UI/loading/Loading";

const BigImage: FC<{ imageUrl: string }> = ({ imageUrl }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [image, setImage] = useState<string | StaticImageData>(imageUrl);

	return (
		<div className={classes.image}>
			<Image
				src={image}
				width={10000}
				height={10000}
				alt=""
				onLoadingComplete={() => setIsLoading(false)}
				onError={() => {
					setImage(defaultImage);
					setIsLoading(false);
				}}
			/>

			{isLoading && <Loading className={classes.loading} />}
		</div>
	);
};

export default BigImage;
