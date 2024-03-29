import { ChangeEvent, useState, Dispatch, SetStateAction } from "react";

interface IUseTextFieldProps {
	minLength?: number;
	maxLength?: number;
	numLettOnly?: boolean;
	allowEmail?: boolean;
	allowWhitespace?: boolean;
	defaultValue?: string;
}

interface IUseTextFieldReturn {
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	error: string | null;
	setValue: Dispatch<SetStateAction<string>>;
	setFirstChange: Dispatch<SetStateAction<boolean>>;
}

const numLettOnlyRegExp = /^[a-zA-Z0-9]+$/i;
const emailValidationRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const whiteSpacesRegExp = /\s/g;

export const useTextField = ({
	maxLength,
	minLength = 0,
	numLettOnly = false,
	allowWhitespace = false,
	allowEmail = false,
	defaultValue,
}: IUseTextFieldProps): IUseTextFieldReturn => {
	const [value, setValue] = useState(defaultValue || "");
	const [firstChange, setFirstChange] = useState(false);

	const isValid = (input: string) => {
		const trimmedInput = input;

		if (numLettOnly) return numLettOnlyRegExp.test(trimmedInput);

		if (allowEmail) return emailValidationRegExp.test(trimmedInput);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const inputSpaceRemove = event.target.value.trim().replace(whiteSpacesRegExp, "");
		setValue(
			allowWhitespace
				? event.target.value.slice(0, maxLength)
				: inputSpaceRemove.slice(0, maxLength)
		);
		!firstChange && setFirstChange(true);
	};

	const errorNumEmail = `${numLettOnly ? "Must contain only letters and numbers." : ""}${
		allowEmail ? "Must be a valid email address." : ""
	}`;
	const errLength = `${
		value.trim().length < minLength ? ` Minimum field length ${minLength} characters` : ""
	}`;

	return {
		value,
		setValue,
		onChange: handleChange,
		setFirstChange,
		error: firstChange ? `${(!isValid(value) && errorNumEmail) || ""}${errLength || ""}` : null,
	};
};
