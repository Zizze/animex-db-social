import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import CloseModal from "@Components/UI/btn/CloseModal";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { setCategories } from "@Store/animeJikan/animeJikanSlice";
import { Dispatch, FC, SetStateAction, useState } from "react";

import Genres from "./genres/Genres";
import classes from "./SetGenres.module.scss";
import Themes from "./themes/Themes";

interface IProps {
	isShow: boolean;
	setIsShow: Dispatch<SetStateAction<boolean>>;
}

const SetGenres: FC<IProps> = ({ isShow, setIsShow }) => {
	const [genres, setGenres] = useState<string[]>([]);
	const dispatch = useAppDispatch();
	const { orderBy, status, activePage, search, startDate, mainHomeCategoryActive } = useAppSelector(
		(state) => state.animeJikan
	);

	const onCloseModal = () => {
		setIsShow(false);
	};

	const onConfirmModal = () => {
		if (genres.length > 0) {
			dispatch(setCategories(genres));
			setGenres([]);
		}
		setIsShow(false);
	};

	const selectedCheckbox = (id: string) => {
		const include = genres.includes(id);
		if (include) {
			setGenres((prev) => prev.filter((i) => i !== id));
			return;
		} else {
			setGenres((prev) => [...prev, id]);
			return;
		}
	};

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

export default SetGenres;
