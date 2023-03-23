import { TypeRootState } from "@Store/store";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<TypeRootState> = useSelector;
