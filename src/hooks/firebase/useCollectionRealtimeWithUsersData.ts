import { buildCollectionRef, IQueryOptions } from "@/utils/firebase/buildCollectionRef";
import { db } from "@Project/firebase";
import {
	doc,
	DocumentData,
	getDoc,
	getDocs,
	onSnapshot,
	QueryDocumentSnapshot,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface IGetUsersByCategoryReturn<I> {
	data: I[] | null;
	lastDoc: QueryDocumentSnapshot<DocumentData> | null;
	loadMoreData: () => void;
	isLastDocs: boolean;
	isLoading: boolean;
	onReload: () => void;
}

export const useCollectionRealtimeWithUsersData = <I>(
	collectionPath: string,
	queryOptions: IQueryOptions,
	condition = false
): IGetUsersByCategoryReturn<I> => {
	const [data, setData] = useState<I[] | null>(null);
	const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
	const [isLastDocs, setIsLastDocs] = useState(false);

	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [updateEffect, setUpdateEffect] = useState(false);

	useEffect(() => {
		if (condition) {
			isLoading && setIsLoading(false);
			return;
		}
		error && setError(false);
		isLoading && setIsLoading(true);

		const collectionRef = buildCollectionRef(collectionPath, queryOptions);

		const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
			const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
			const promises: Promise<I>[] = [];

			querySnapshot.forEach((document) => {
				promises.push(
					new Promise<I>((resolve, reject) => {
						onSnapshot(doc(db, `users/${document.id}`), (user) => {
							if (user.exists()) {
								resolve(user.data() as I);
							} else {
								reject(`Document does not exist: ${user.id}`);
							}
						});
					})
				);
			});

			Promise.all(promises)
				.then((firebaseData) => {
					if (JSON.stringify(firebaseData) !== JSON.stringify(data)) {
						setData(firebaseData);
						setLastDoc(lastVisibleDoc);
						setIsLastDocs(querySnapshot.docs.length < 10);
					}
				})
				.catch(() => {
					setError(true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		});

		return () => {
			unsubscribe();
		};
	}, [collectionPath, JSON.stringify(queryOptions), updateEffect]);

	const loadMoreData = useCallback(async () => {
		if (!lastDoc || isLastDocs) return;
		if (condition) {
			isLoading && setIsLoading(false);
			return;
		}
		error && setError(false);
		isLoading && setIsLoading(true);

		const collectionRef = buildCollectionRef(collectionPath, queryOptions, lastDoc);

		const querySnapshot = await getDocs(collectionRef);
		const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		const promises = querySnapshot.docs.map(async (friend) => {
			const docRef = doc(db, "users", friend.id);
			const docSnap = await getDoc(docRef);

			return docSnap.data() as I;
		});

		const dataDocs = await Promise.all(promises);

		setData((prev) => prev && [...prev, ...dataDocs]);
		setLastDoc(lastVisible as QueryDocumentSnapshot);
		setIsLastDocs(querySnapshot.docs.length < (queryOptions.limit || 0));
		setIsLoading(false);
	}, [lastDoc, isLastDocs]);

	const onReload = useCallback(() => setUpdateEffect((prev) => !prev), []);

	return {
		loadMoreData,
		data,
		isLastDocs,
		isLoading,
		onReload,
		lastDoc,
	};
};
