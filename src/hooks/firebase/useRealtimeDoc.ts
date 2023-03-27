import { db } from "@Project/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useRealtimeDoc = <I>(path: string): I | null => {
	const [data, setData] = useState<I | null>(null);

	useEffect(() => {
		const docRef = doc(db, path);
		const unsub = onSnapshot(docRef, (doc) => {
			if (!doc.exists()) return setData(null);
			setData(doc.data() as I);
		});

		return () => unsub();
	}, [path]);

	return data;
};
