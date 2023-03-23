import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

type TypeOut = {
	ref: any;
	isShow: boolean;
	setIsShow: Dispatch<SetStateAction<boolean>>;
};

export const useOutside = (initiaIsVisible: boolean): TypeOut => {
	const [isShow, setIsShow] = useState(initiaIsVisible);
	const ref = useRef<HTMLElement>(null);

	const handleClickOutside = (event: any) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setIsShow(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	});

	return { ref, isShow, setIsShow };
};
