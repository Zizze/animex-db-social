import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { mainHomeCategory } from "@Store/animeJikan/animeJikanSlice";
import { FC, Dispatch, SetStateAction } from "react";
import { mainCategories } from "./categories.data";
import classes from "./Categories.module.scss";

interface IProps {
	setIsShow: Dispatch<SetStateAction<boolean>>;
}

const Categories: FC<IProps> = ({ setIsShow }) => {
	const dispatch = useAppDispatch();
	const { mainHomeCategoryActive } = useAppSelector((state) => state.animeJikan);

	const onClickHandler = (mainCategory: string) => {
		if (mainCategory === "Set categories") {
			setIsShow(true);
			return;
		}
		dispatch(mainHomeCategory(mainCategory));
	};

	return (
		<ul className={classes.categories}>
			{mainCategories.map((mainCategory) => {
				return (
					<li key={mainCategory}>
						<CategoryBtn
							isActive={mainHomeCategoryActive === mainCategory ? true : false}
							onClickHandler={() => onClickHandler(mainCategory)}
						>
							{mainCategory}
						</CategoryBtn>
					</li>
				);
			})}
		</ul>
	);
};

export default Categories;
