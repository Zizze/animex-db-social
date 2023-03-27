import { db } from "@Project/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

interface IUseGetDocReturn<I> {
	data: I | null;
	isLoading: boolean;
	error: boolean;
}

export const useGetDoc = <I>(path: string): IUseGetDocReturn<I> => {
	const [data, setData] = useState<I | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const docGet = async () => {
			const docRef = doc(db, path);

			try {
				const receivedDoc = await getDoc(docRef);
				if (receivedDoc.exists()) {
					if (isMounted) setData(receivedDoc.data() as I);
				} else {
					if (isMounted) setData(null);
				}
			} catch (err) {
				if (isMounted) setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		setTimeout(() => {
			docGet();
		}, 0);

		return () => {
			isMounted = false;
		};
	}, [path]);

	return {
		data,
		isLoading,
		error,
	};
};
