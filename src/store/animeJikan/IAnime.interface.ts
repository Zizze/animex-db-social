export interface IGetParams {
	selectedGenres: string[];
	mainHomeMode: string;
	mainHomeCategoryActive: string;
	search: string;
	activePage: number;
	sort: string;
	orderBy: string;
	id?: number;
	status: string;
	type: string;
	startDate: string;
}

export interface IAnimeJikan {
	data: IDataAnime[];
	pagination: IDataPagination;
}

export interface IDataAnime {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
	};
	trailer: ITrailerJikan;
	approved: boolean;

	title: string;
	title_english: string;
	title_japanese: string;
	title_synonyms: [];
	type: string;
	source: string;
	episodes: string | number;
	status: string;
	airing: false;
	aired: {
		from: string | number;
		to: string | number;
		prop: {
			from: {
				day: string | number;
				month: string | number;
				year: string | number;
			};
			to: {
				day: string | number;
				month: string | number;
				year: string | number;
			};
		};
	};
	duration: string;
	rating: string | number;
	score: number;
	scored_by: number;
	rank: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis: string;
	background: string;
	season: string;
	year: number | string;
	broadcast: {
		day: string;
		time: number | string;
		timezone: string;
		string: number | string;
	};
	producers: [];
	licensors: [];
	studios: [];
	genres: [
		{
			mal_id: number;
			type: string;
			name: string;
			url: string;
		}
	];
	explicit_genres: [];
	themes: [
		{
			mal_id: number;
			type: string;
			name: string;
			url: string;
		}
	];
	demographics: [];
}

export interface IJitakFullAnime {
	data: IDataAnime;
}

interface IDataPagination {
	last_visible_page: number | string;
	has_next_page: boolean;
	current_page: number | string;
}

interface IGenreThemeData {
	mal_id: number;
	name: string;
	url: string;
	count: number;
}

export interface IGenreTheme {
	data: IGenreThemeData[];
}

export interface ITrailerJikan {
	youtube_id: string;
	url: string;
	embed_url: string;
	images: {
		image_url: string;
		small_image_url: string;
		medium_image_url: string;
		large_image_url: string;
		maximum_image_url: string;
	};
}
