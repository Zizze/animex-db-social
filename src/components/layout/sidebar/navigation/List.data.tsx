import {
	RiHome5Fill,
	RiPieChart2Fill,
	RiPauseCircleFill,
	RiDraftFill,
	RiFileCloudFill,
	RiFileForbidFill,
	RiFileInfoFill,
} from "react-icons/ri";
import { BsFillQuestionDiamondFill } from "react-icons/bs";

export interface INavList {
	id: Number;
	name: string;
	href: string;
	img: "string" | React.ReactNode;
	count?: number;
}

export const dataListTop: INavList[] = [
	{
		id: 1,
		name: "Home",
		img: <RiHome5Fill />,
		href: "/",
	},
	{
		id: 2,
		name: "Top score",
		img: <RiPieChart2Fill />,
		href: "/top-anime",
	},
	{
		id: 3,
		name: "Random",
		img: <BsFillQuestionDiamondFill />,
		href: "/random-anime",
	},
];

export const dataListCenter = [
	{
		id: 1,
		name: "Completed",
		img: <RiFileInfoFill />,
		href: "/my-list/completed",
	},
	{
		id: 2,
		name: "Watching",
		img: <RiDraftFill />,
		href: "/my-list/watching",
	},
	{
		id: 3,
		name: "Postponed",
		img: <RiFileCloudFill />,
		href: "/my-list/postponed",
	},
	{
		id: 4,
		name: "Dropped",
		img: <RiFileForbidFill />,
		href: "/my-list/dropped",
	},
];
