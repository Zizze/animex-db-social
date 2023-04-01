import { db } from "@Project/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface IUseRealtimeDocReturn<I> {
	data: I | null;
	loading: boolean;
	error: boolean;
}

export const useRealtimeDoc = <I>(path: string, condition = false): IUseRealtimeDocReturn<I> => {
	const [data, setData] = useState<I | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (condition) {
			loading && setLoading(false);
			return;
		}
		const docRef = doc(db, path);
		const unsub = onSnapshot(
			docRef,
			(doc) => {
				if (doc.exists()) {
					setData(doc.data() as I);
				} else {
					return setData(null);
				}
				error && setError(false);
			},
			(error) => {
				setError(true);
			}
		);

		setLoading(false);
		return () => unsub();
	}, [path]);

	return { data, loading, error };
};
