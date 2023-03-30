import { db } from "@Project/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface IUseRealtimeDocReturn<I> {
	data: I | null;
	loading: boolean;
}

export const useRealtimeDoc = <I>(path: string, condition = false): IUseRealtimeDocReturn<I> => {
	const [data, setData] = useState<I | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (condition) return;
		const docRef = doc(db, path);
		const unsub = onSnapshot(docRef, (doc) => {
			if (doc.exists()) {
				setData(doc.data() as I);
			} else {
				return setData(null);
			}
		});

		setLoading(false);
		return () => unsub();
	}, [path]);

	return { data, loading };
};
