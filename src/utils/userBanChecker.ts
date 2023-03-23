import { Timestamp } from "firebase/firestore";

export const userBanChecker = (endBanTimesTamp: Timestamp) => {
	if (!endBanTimesTamp) return;
	const endTimestamp = endBanTimesTamp;
	const nowTimestamp = Timestamp.now();

	return nowTimestamp < endTimestamp;
};
