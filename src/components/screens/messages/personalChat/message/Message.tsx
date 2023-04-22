import { FC } from "react";
import cn from "classnames";
import classes from "./Message.module.scss";
import { IMessageFirebase } from "@/types/types";

import Image from "next/image";
import { RiDownloadCloudFill, RiFile2Line, RiMovieLine, RiFileMusicLine } from "react-icons/ri";
import Link from "next/link";

const Message: FC<{ messageObj: IMessageFirebase }> = ({ messageObj }) => {
	const { message, sender, files } = messageObj;

	const onlyImageFiles = files?.filter((file) => file.type.includes("image"));

	return (
		<li className={cn(classes.message, sender && classes.currUser)}>
			{onlyImageFiles && !!onlyImageFiles.length && (
				<div className={classes.images}>
					<Link href={onlyImageFiles[0].downloadURL} target="_blank" download>
						<Image
							className={classes.firstImage}
							src={onlyImageFiles[0].downloadURL}
							width={1000}
							height={300}
							alt=""
						/>
					</Link>

					{onlyImageFiles.length > 1 && (
						<ul className={classes.imagesList}>
							{onlyImageFiles.slice(1).map((file, index) => {
								return (
									<li key={file.name + index}>
										<Link href={file.downloadURL} target="_blank" download>
											<Image src={file.downloadURL} width={500} height={300} alt="" />
										</Link>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}

			<p>{message}</p>

			{files && !!files.length && (
				<ul className={classes.files}>
					{files.map((file, index) => {
						if (!file.type.includes("image")) {
							return (
								<li key={file.name + index}>
									{file.type.includes("video") ? (
										<RiMovieLine />
									) : file.type.includes("audio") ? (
										<RiFileMusicLine />
									) : (
										<RiFile2Line />
									)}
									<span>{file.name}</span>
									<Link
										className={classes.downloadLink}
										download
										target="_blank"
										href={file.downloadURL}
									>
										<RiDownloadCloudFill />
									</Link>
								</li>
							);
						}
					})}
				</ul>
			)}
		</li>
	);
};

export default Message;
