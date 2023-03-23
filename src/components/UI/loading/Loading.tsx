import { FC } from "react";
import { Loading as Loader } from "@nextui-org/react";
import classes from "./Loading.module.scss";
import cn from "classnames";

const Loading: FC<{ className?: string }> = ({ className = "" }) => {
	const classNames = cn(classes.wrapper, className);

	return (
		<div className={classNames}>
			<Loader
				color="currentColor"
				loadingCss={{ $$loadingSize: "100px", $$loadingBorder: "10px" }}
			/>
		</div>
	);
};

export default Loading;
