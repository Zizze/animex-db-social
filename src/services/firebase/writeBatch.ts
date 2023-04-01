import { buildCollectionRef, IQueryOptions } from "@/utils/firebase/buildCollectionRef";
import { db } from "@Project/firebase";
import { getDocs, writeBatch } from "firebase/firestore";

interface IWriteBatch {
	queryOptions?: IQueryOptions;
	type: "delete" | "update";
	dataAction?: any;
	filterData?: {
		name: string | number;
		docKey: string | number;
		notEqual: string | number;
	};
}

export const batchWrite = async (
	path: string,
	{ queryOptions, type, dataAction, filterData }: IWriteBatch
) => {
	const collectionRef = buildCollectionRef(path, queryOptions);
	const querySnapshot = await getDocs(collectionRef);

	const batch = writeBatch(db);
	querySnapshot.docs.forEach((doc) => {
		switch (type) {
			case "delete":
				batch.delete(doc.ref);
				break;
			case "update":
				if (!filterData) {
					batch.update(doc.ref, dataAction);
				} else {
					const { name, docKey, notEqual } = filterData;
					const docData = doc.data()[docKey];
					batch.update(doc.ref, {
						...dataAction,
						[name]: docData.filter((arr: any) => arr !== notEqual),
					});
				}

				break;
		}
	});
	await batch.commit();
};
