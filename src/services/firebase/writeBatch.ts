import { buildCollectionRef, IQueryOptions } from "@/utils/firebase/buildCollectionRef";
import { db } from "@Project/firebase";
import { getDocs, writeBatch } from "firebase/firestore";

interface IWriteBatch {
	queryOptions?: IQueryOptions;
	type: "delete" | "update";
	dataAction?: any;
}

export const batchWrite = async (path: string, { queryOptions, type, dataAction }: IWriteBatch) => {
	const collectionRef = buildCollectionRef(path, queryOptions);
	const querySnapshot = await getDocs(collectionRef);

	const batch = writeBatch(db);
	querySnapshot.docs.forEach((doc) => {
		switch (type) {
			case "delete":
				batch.delete(doc.ref);
				break;
			case "update":
				batch.update(doc.ref, dataAction);
				break;
		}
	});
	await batch.commit();
};
