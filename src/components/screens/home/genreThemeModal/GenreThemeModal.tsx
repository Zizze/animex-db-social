import { useAppDispatch } from "@/hooks/useAppDispatch";
import CloseModal from "@Components/UI/btn/CloseModal";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { setCategories } from "@Store/animeJikan/animeJikanSlice";
import { Dispatch, FC, SetStateAction, useState, useCallback } from "react";

import Genres from "./genres/Genres";
import classes from "./GenreThemeModal.module.scss";
import Themes from "./themes/Themes";

interface IProps {
	isShow: boolean;
	setIsShow: Dispatch<SetStateAction<boolean>>;
}

const GenreThemeModal: FC<IProps> = ({ isShow, setIsShow }) => {
	const [genreTheme, setGenreTheme] = useState<string[]>([]);
	const dispatch = useAppDispatch();

	const onConfirmModal = useCallback(() => {
		if (genreTheme.length > 0) {
			dispatch(setCategories(genreTheme));
			setGenreTheme([]);
		}
		setIsShow(false);
	}, [genreTheme]);

	const selectedCheckbox = useCallback(
		(id: string) => {
			const include = genreTheme.includes(id);
			if (include) {
				setGenreTheme((prev) => prev.filter((i) => i !== id));
			} else {
				setGenreTheme((prev) => [...prev, id]);
			}
		},
		[genreTheme]
	);

	const onCloseModal = useCallback(() => setIsShow(false), []);
	return (
		<>
			{isShow && (
				<ModalWrapper onClickHandler={onCloseModal}>
					<div className={classes.container}>
						<div className={classes.icoClose}>
							<CloseModal onClickHandler={onCloseModal} />
						</div>
						<Genres selectedCheckbox={selectedCheckbox} />
						<Themes selectedCheckbox={selectedCheckbox} />
						<div className={classes.btns}>
							<DefaultBtn classMode="main" onClickHandler={onConfirmModal}>
								Сonfirm
							</DefaultBtn>
							<DefaultBtn onClickHandler={onCloseModal}>Close</DefaultBtn>
						</div>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default GenreThemeModal;
