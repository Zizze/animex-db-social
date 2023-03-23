import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IGetParams } from "./IAnime.interface";

const initialState: IGetParams = {
	mainHomeMode: "Home",
	mainHomeCategoryActive: "All anime",
	search: "",
	activePage: 1,
	sort: "",
	orderBy: "",
	status: "",
	type: "",
	startDate: "0",
	selectedGenres: [],
};

export const animeJikanSlice = createSlice({
	name: "animeJikan",
	initialState,
	reducers: {
		searchValueData: (state, action: PayloadAction<string>) => {
			state.search = action.payload;
			state.mainHomeCategoryActive = "";
			state.orderBy = "";
			state.status = "";
			state.activePage = 1;
			state.selectedGenres = [];
		},
		mainHomeCategory: (state, action: PayloadAction<string>) => {
			state.mainHomeCategoryActive = action.payload;
			state.orderBy = "";
			state.search = "";
			state.status = "";
			state.activePage = 1;
			state.selectedGenres = [];

			switch (action.payload) {
				case "Popular":
					state.orderBy = "popularity";
					return;
				case "Ongoings":
					state.status = "airing";
					return;
			}
		},
		changePageHome: (state, action: PayloadAction<number>) => {
			state.activePage = action.payload;
		},
		changeHomeMode: (state, action: PayloadAction<string>) => {
			if (state.mainHomeMode !== action.payload) {
				state.selectedGenres = [];
				state.search = "";
				state.mainHomeMode = action.payload;
				state.activePage = 1;
			}
		},
		setCategories: (state, action: PayloadAction<string[]>) => {
			state.mainHomeCategoryActive = "Set categories";
			state.selectedGenres = action.payload;
			state.activePage = 1;
			state.orderBy = "";
			state.search = "";
			state.status = "";
		},
	},
});

export const { mainHomeCategory, searchValueData, changePageHome, changeHomeMode, setCategories } =
	animeJikanSlice.actions;
export default animeJikanSlice.reducer;
