import { buildCollectionRef, IQueryOptions } from "@/utils/firebase/buildCollectionRef";
import { DocumentData, getDocs, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";

interface IGetUsersByCategoryReturn<T> {
	data: T[] | null;
	lastDoc: QueryDocumentSnapshot<DocumentData> | null;
	loadMoreData: () => void;
	isLastDocs: boolean;
	isLoading: boolean;
	onReload: () => void;
	error: boolean;
}

export const useCollectionRealtime = <T>(
	collectionPath: string,
	queryOptions: IQueryOptions
): IGetUsersByCategoryReturn<T> => {
	const [data, setData] = useState<T[] | null>(null);
	const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
	const [isLastDocs, setIsLastDocs] = useState(false);

	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [updateEffect, setUpdateEffect] = useState(false);

	useEffect(() => {
		setError(false);
		const collectionRef = buildCollectionRef(collectionPath, queryOptions);

		const unsubscribe = onSnapshot(
			collectionRef,
			(querySnapshot) => {
				const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
				const collectionData: T[] = [];

				querySnapshot.forEach((doc) => {
					collectionData.push({ ...doc.data(), docId: doc.id } as T);
				});

				if (JSON.stringify(collectionData) !== JSON.stringify(data)) {
					setData(collectionData);
					setLastDoc(lastVisibleDoc as QueryDocumentSnapshot);
					setIsLastDocs(collectionData.length < (queryOptions.limit || 0));
				}
				setIsLoading(false);
			},
			() => setError(true)
		);

		return () => unsubscribe();
	}, [collectionPath, JSON.stringify(queryOptions), updateEffect]);

	console.log("HOOK: useCollectionRealtime");

	const loadMoreData = useCallback(async () => {
		if (!lastDoc || isLastDocs) return;
		setError(false);

		const collectionRef = buildCollectionRef(collectionPath, queryOptions, lastDoc);
		try {
			const getMoreDocs = await getDocs(collectionRef);
			const lastVisibleDoc = getMoreDocs.docs[getMoreDocs.docs.length - 1];
			const moreData = getMoreDocs.docs.map((doc) => ({ ...doc.data(), docId: doc.id } as T));

			setData((prev) => prev && [...prev, ...moreData]);
			setLastDoc(lastVisibleDoc as QueryDocumentSnapshot);
			setIsLastDocs(moreData.length < (queryOptions.limit || 0));
			setIsLoading(false);
		} catch {
			setError(true);
		}
	}, [lastDoc, isLastDocs]);

	const onReload = useCallback(() => setUpdateEffect((prev) => !prev), []);

	return {
		loadMoreData,
		data,
		isLastDocs,
		isLoading,
		onReload,
		lastDoc,
		error,
	};
};
