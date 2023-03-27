import { db } from "@Project/firebase";
import {
	collection,
	DocumentData,
	limit,
	orderBy,
	Query,
	query,
	startAfter,
	where,
	WhereFilterOp,
} from "firebase/firestore";

export type WhereQuery = [string, WhereFilterOp, any];
export interface IQueryOptions {
	limit?: number;
	orderBy?: [string, "asc" | "desc"];
	where?: WhereQuery[] | null;
}

export function buildCollectionRef(
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
