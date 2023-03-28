import { buildCollectionRef, IQueryOptions } from "@/utils/firebase/buildCollectionRef";
import { db } from "@Project/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface IUseRealtimeDocReturn<I> {
	data: I | null;
	loading: boolean;
}

export const useRealtimeDoc = <I>(path: string): IUseRealtimeDocReturn<I> => {
	const [data, setData] = useState<I | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const docRef = doc(db, path);
		const unsub = onSnapshot(docRef, (doc) => {
			if (!doc.exists()) return setData(null);
			setData(doc.data() as I);
		});

		setLoading(false);
		return () => unsub();
	}, [path]);

	return { data, loading };
};
