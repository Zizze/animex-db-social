import { configureStore } from "@reduxjs/toolkit";
import { animeJikanApi } from "./animeJikan/animeJikan.api";
import animeReducer from "./animeJikan/animeJikanSlice";

export const store = configureStore({
	reducer: {
		[animeJikanApi.reducerPath]: animeJikanApi.reducer,
		animeJikan: animeReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(animeJikanApi.middleware),
});

export type TypeRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
