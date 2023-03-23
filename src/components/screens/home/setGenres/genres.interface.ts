interface Datum {
	mal_id: number;
	name: string;
	url: string;
	count: number;
}

export interface IGenres {
	data: Datum[];
}
