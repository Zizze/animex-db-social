import { FC, useState, useEffect } from "react";
import classes from "./AllComments.module.scss";

import { useAuthContext } from "@/context/useAuthContext";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { ICommentFirebase } from "@/types/types";
import Comment from "./comment/Comment";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { getComments, IAdminPanelCommReturn } from "@/services/firebase/adminPanel/getComments";

const AllComments: FC = () => {
	const [lastVisibleData, setLastVisibleData] =
		useState<QueryDocumentSnapshot<DocumentData> | null>();
	const [isLastData, setIsLastData] = useState<boolean>();
	const [comments, setComments] = useState<ICommentFirebase[]>([]);

	const { user } = useAuthContext();
	const [pressHide, setPressHide] = useState(false);
	const { getAllComments, loadMoreComments } = getComments();

	useEffect(() => {
		const getComments = (data: IAdminPanelCommReturn) => {
			const { comments, lastDoc, isLastData } = data;
			setLastVisibleData(lastDoc);
			setComments(comments);
			setIsLastData(isLastData);
		};

		getAllComments(getComments);
	}, [user, pressHide]);

	const moreComments = async () => {
		if (!user && !lastVisibleData) return;
		const getMoreData = (await loadMoreComments(lastVisibleData || null)) as IAdminPanelCommReturn;

		setLastVisibleData(getMoreData.lastDoc);
		setComments((prev) => [...prev, ...getMoreData.comments]);
		setIsLastData(getMoreData.isLastData);
	};

	return (
		<div className={classes.wrapper}>
			<h6 className={classes.title}>All anime coments</h6>
			<ul className={classes.comments}>
				{comments.map((comment) => (
					<Comment comment={comment} key={comment.id + comment.commentId} />
				))}
			</ul>
			<div className={classes.btns}>
				{!isLastData && (
					<DefaultBtn
						classMode="clear"
						title="More comments"
						className={classes.moreBtn}
						onClickHandler={moreComments}
					>
						More comments
					</DefaultBtn>
				)}
				{comments.length > 10 && (
					<DefaultBtn
						classMode="clear"
						title="Hide comments"
						className={classes.hideBtn}
						onClickHandler={() => setPressHide((prev) => !prev)}
					>
						Hide comments
					</DefaultBtn>
				)}
			</div>
		</div>
	);
};

export default AllComments;
