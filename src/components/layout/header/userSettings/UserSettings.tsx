import { useAuthContext } from "@/context/useAuthContext";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Checkbox from "@Components/UI/checkbox/Checkbox";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { db } from "@Project/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FC, Dispatch, SetStateAction, useState, FormEvent, useEffect } from "react";
import { dataSettFriend, dataSettMess, dataSettProfileVisible } from "./userSettings.data";
import classes from "./UserSettings.module.scss";
import { IUserFirebase } from "@/types/types";
import { popMessage } from "@/utils/popMessage/popMessage";
import CheckboxGroup from "@Components/UI/checkbox/сheckboxGroup/CheckboxGroup";
import Loading from "@Components/UI/loading/Loading";

interface IProps {
	setActiveSetings: Dispatch<SetStateAction<boolean>>;
}

const UserSettings: FC<IProps> = ({ setActiveSetings }) => {
	const { user, userStorage } = useAuthContext();
	const { popError, popSuccess, ctxMessage } = popMessage();
	const [isLoading, setIsLoading] = useState(false);

	const currentSettings = {
		friends: userStorage?.settings?.friends || dataSettFriend[0],
		messages: userStorage?.settings?.messages || dataSettMess[0],
		profile: userStorage?.settings?.profile || dataSettProfileVisible[0],
	};

	const [messSetting, setMessSetting] = useState<boolean | string>(currentSettings.messages);
	const [friendSetting, setFriendSetting] = useState<boolean | string>(currentSettings.friends);
	const [profileSetting, setProfileSetting] = useState<boolean | string>(currentSettings.profile);

	const onSubmitSettings = async (e: FormEvent) => {
		e.preventDefault();
		const settings = {
			friends: friendSetting,
			messages: messSetting,
			profile: profileSetting,
		};
		const notChanged = JSON.stringify(currentSettings) === JSON.stringify(settings);
		if (!user || notChanged) return;

		setIsLoading(true);
		try {
			const userRef = doc(db, `users/${user.uid}`);
			await updateDoc(userRef, {
				settings: {
					friends: friendSetting,
					messages: messSetting,
					profile: profileSetting,
				},
			});
			popSuccess("Changes saved.");
		} catch {
			popError("Change error.");
		} finally {
			setIsLoading(false);
		}
	};

	const onChangeFriendSett = (name: string) => {
		setFriendSetting(name);
	};

	const onChangeMessSett = (name: string) => {
		setMessSetting(name);
	};

	const onChangeProfileSett = (name: string) => {
		setProfileSetting(name);
	};

	return (
		<>
			{ctxMessage}
			<ModalWrapper onClickHandler={() => setActiveSetings(false)}>
				{isLoading && <Loading />}
				<div className={classes.wrapper}>
					<h5>Settings</h5>
					<form onSubmit={onSubmitSettings}>
						<CheckboxGroup
							options={dataSettFriend}
							selectedOption={friendSetting}
							onChangeHandler={onChangeFriendSett}
							title={"Who can invite you to be friends?"}
						/>
						<CheckboxGroup
							options={dataSettMess}
							selectedOption={messSetting}
							onChangeHandler={onChangeMessSett}
							title={"Who can write letters to me?"}
						/>
						<CheckboxGroup
							options={dataSettProfileVisible}
							selectedOption={profileSetting}
							onChangeHandler={onChangeProfileSett}
							title={"Who can see basic information on my profile?"}
						/>

						<div className={classes.btns}>
							<DefaultBtn type="submit">Save</DefaultBtn>
							<DefaultBtn onClickHandler={() => setActiveSetings(false)}>Close</DefaultBtn>
						</div>
					</form>
				</div>
			</ModalWrapper>
		</>
	);
};

export default UserSettings;
