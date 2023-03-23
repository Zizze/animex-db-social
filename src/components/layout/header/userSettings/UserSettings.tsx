import { useAuthContext } from "@/context/useAuthContext";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Checkbox from "@Components/UI/checkbox/Checkbox";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { db } from "@Project/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FC, Dispatch, SetStateAction, useState, FormEvent, useEffect } from "react";
import { dataSettFriend, dataSettMess, dataSettProfileVisible } from "./userSettings.data";
import classes from "./UserSettings.module.scss";
import { IUserFirebase } from "../../../../types/types";

interface IProps {
	setActiveSetings: Dispatch<SetStateAction<boolean>>;
}

const UserSettings: FC<IProps> = ({ setActiveSetings }) => {
	const { user } = useAuthContext();
	const [messSetting, setMessSetting] = useState<boolean | string>("");
	const [friendSetting, setFriendSetting] = useState<boolean | string>("");
	const [profileSett, setProfileSett] = useState<boolean | string>("");

	useEffect(() => {
		if (!user) return;
		const getUserSettings = async () => {
			const userRef = doc(db, `users/${user.uid}`);
			const userDoc = await getDoc(userRef);
			const { settings } = userDoc.data() as IUserFirebase;
			setFriendSetting(settings?.friends || dataSettFriend[0]);
			setMessSetting(settings?.messages || dataSettMess[0]);
			setProfileSett(settings?.profile || dataSettProfileVisible[0]);
		};
		getUserSettings();
	}, []);

	const onSubmitSettings = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;
		const userRef = doc(db, `users/${user.uid}`);
		await updateDoc(userRef, {
			settings: {
				friends: friendSetting,
				messages: messSetting,
				profile: profileSett,
			},
		});
	};

	const onChangeFriendSett = (name: string) => {
		setFriendSetting(name);
	};

	const onChangeMessSett = (name: string) => {
		setMessSetting(name);
	};

	const onChangeProfileSett = (name: string) => {
		setProfileSett(name);
	};

	return (
		<ModalWrapper onClickHandler={() => setActiveSetings(false)}>
			<div className={classes.wrapper}>
				<h5>Settings</h5>
				<form onSubmit={onSubmitSettings}>
					<div className={classes.checkboxesBlock}>
						<p>Who can invite you to be friends?</p>
						<ul className={classes.checkbox}>
							{dataSettFriend.map((sett) => (
								<Checkbox
									onlyOneMode={true}
									name={sett}
									id={sett}
									onChangeHandler={onChangeFriendSett}
									disabled={sett === friendSetting}
									key={sett}
								/>
							))}
						</ul>
					</div>
					<div className={classes.checkboxesBlock}>
						<p>Who can write letters to me?</p>
						<ul className={classes.checkbox}>
							{dataSettMess.map((sett) => (
								<Checkbox
									onlyOneMode={true}
									name={sett}
									id={sett}
									onChangeHandler={onChangeMessSett}
									disabled={sett === messSetting}
									key={sett}
								/>
							))}
						</ul>
					</div>
					<div className={classes.checkboxesBlock}>
						<p>Who can see basic information on my profile?</p>
						<ul className={classes.checkbox}>
							{dataSettProfileVisible.map((sett) => (
								<Checkbox
									onlyOneMode={true}
									name={sett}
									id={sett}
									onChangeHandler={onChangeProfileSett}
									disabled={sett === profileSett}
									key={sett}
								/>
							))}
						</ul>
					</div>
					<div className={classes.btns}>
						<DefaultBtn type="submit">Save</DefaultBtn>
						<DefaultBtn onClickHandler={() => setActiveSetings(false)}>Close</DefaultBtn>
					</div>
				</form>
			</div>
		</ModalWrapper>
	);
};

export default UserSettings;
