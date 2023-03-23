import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

export const convertTimestamp = (timestamp: Timestamp | null) => {
	if (!timestamp) return null;
	const timestampToDate = timestamp.toDate();
	const formattedDate = dayjs(timestampToDate).format("DD.MM.YYYY HH:mm");

	return formattedDate.toString();
};
