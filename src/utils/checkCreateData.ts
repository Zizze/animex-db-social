import { Timestamp } from "firebase/firestore";

export const checkCreateData = (timestampFirebaseSeconds: number) => {
	if (timestampFirebaseSeconds) {
		const date = Timestamp.now().toDate();
		const sentDate = new Date(timestampFirebaseSeconds * 1000);
		const delayMessage = date.getDate() - sentDate.getDate();

		if (delayMessage < 8 && delayMessage > 1) {
			const nameDay = sentDate.toLocaleDateString("en-US", { weekday: "long" });
			return nameDay;
		} else if (delayMessage === 0) {
			const minutes =
				`${sentDate.getMinutes()}`.length < 2
					? `0${sentDate.getMinutes()}`
					: `${sentDate.getMinutes()}`;
			return `${sentDate.getHours()}:${minutes}`;
		} else if (delayMessage === 1) {
			return "Yesterday";
		} else if (delayMessage > 7) {
			return sentDate.toLocaleDateString();
		} else {
			return null;
		}
	}
};
