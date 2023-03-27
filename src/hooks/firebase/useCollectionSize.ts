import { db } from "@Project/firebase";
import { collection, collectionGroup, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

export const useCollectionSize = (path: string, group?: boolean): number => {
	const [size, setSize] = useState(0);

	useEffect(() => {
		let collectionRef;
		if (group) collectionRef = collectionGroup(db, path);
		if (!group) collectionRef = collection(db, path);
		if (!collectionRef) return;

		const unsubscribe = onSnapshot(collectionRef, (docs) => {
			if (size !== docs.size) setSize(docs.size);
		});
		return () => unsubscribe();
	}, [path]);

	return size;
};
