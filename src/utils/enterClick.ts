import { KeyboardEvent, MutableRefObject } from "react";

interface IEnterClick {
	ref?: MutableRefObject<HTMLFormElement | null>;
	func?: () => void;
}

export const enterClick = (e: KeyboardEvent, { ref, func }: IEnterClick) => {
	if (e.key === "Enter" && !e.shiftKey) {
		if (ref) ref.current?.requestSubmit();
		if (func) func();
	}
};
