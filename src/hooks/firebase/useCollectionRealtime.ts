import { db } from "@Project/firebase";
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	Query,
	QueryDocumentSnapshot,
	startAfter,
	where,
	WhereFilterOp,
} from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";

interface IGetUsersByCategoryReturn<T> {
	data: T[] | null;
	lastDoc: QueryDocumentSnapshot<DocumentData> | null;
	loadMoreData: () => void;
	isLastDocs: boolean;
	isLoading: boolean;
	onReload: () => void;
}

export type WhereQuery = [string, WhereFilterOp, any];
interface IQueryOptions {
	limit?: number;
	orderBy?: [string, "asc" | "desc"];
	where?: WhereQuery[] | null;
}

export const useCollectionRealtime = <T>(
	collectionPath: string,
	queryOptions: IQueryOptions
): IGetUsersByCategoryReturn<T> => {
	const [data, setData] = useState<T[] | null>(null);
	const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
	const [isLastDocs, setIsLastDocs] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [updateEffect, setUpdateEffect] = useState(false);

	useEffect(() => {
		const collectionRef = buildCollectionRef(collectionPath, queryOptions);

		const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
			const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
			const collectionData: T[] = [];

			querySnapshot.forEach((doc) => {
				collectionData.push(doc.data() as T);
			});

			if (JSON.stringify(collectionData) !== JSON.stringify(data)) {
				setData(collectionData);
				setLastDoc(lastVisibleDoc as QueryDocumentSnapshot);
				setIsLastDocs(collectionData.length < (queryOptions.limit || 0));
			}
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, [collectionPath, JSON.stringify(queryOptions), updateEffect]);

	console.log("HOOK: useCollectionRealtime");

	const loadMoreData = useCallback(async () => {
		if (!lastDoc || isLastDocs) return;
		console.log("click loadMore");
		const collectionRef = buildCollectionRef(collectionPath, queryOptions, lastDoc);

		const getMoreDocs = await getDocs(collectionRef);
		const lastVisibleDoc = getMoreDocs.docs[getMoreDocs.docs.length - 1];
		const moreData = getMoreDocs.docs.map((doc) => doc.data() as T);

		setData((prev) => prev && [...prev, ...moreData]);
		setLastDoc(lastVisibleDoc as QueryDocumentSnapshot);
		setIsLastDocs(moreData.length < (queryOptions.limit || 0));
		setIsLoading(false);
	}, []);

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

function buildCollectionRef(
	collectionPath: string,
	queryOptions?: IQueryOptions,
	lastDoc?: DocumentData
) {
	let collectionRef: Query<DocumentData> = collection(db, collectionPath);
	if (queryOptions?.orderBy) {
		collectionRef = query(collectionRef, orderBy(queryOptions.orderBy[0], queryOptions.orderBy[1]));
	}
	if (queryOptions?.where && queryOptions.where) {
		const queries = queryOptions.where.map(([field, operator, value]) =>
			where(field, operator, value)
		);
		collectionRef = query(collectionRef, ...queries);
	}
	if (lastDoc) {
		collectionRef = query(collectionRef, startAfter(lastDoc));
	}
	if (queryOptions?.limit) collectionRef = query(collectionRef, limit(queryOptions.limit));
	return collectionRef;
}
