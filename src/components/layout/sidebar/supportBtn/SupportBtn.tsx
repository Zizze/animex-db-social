import { FC, useState } from "react";
import classes from "./SupportBtn.module.scss";
import { MdSupportAgent } from "react-icons/md";
import SupportForm from "@Components/UI/supportForm/SupportForm";

const SupportBtn: FC = () => {
	const [isActiveSupport, setIsActiveSupport] = useState(false);

	return (
		<div className={classes.wrapper}>
			<button className={classes.supportBtn} onClick={() => setIsActiveSupport(true)}>
				<MdSupportAgent />
				<span className={classes.text}>Support</span>
			</button>
			<SupportForm setIsActiveSupport={setIsActiveSupport} isActiveSupport={isActiveSupport} />
		</div>
	);
};

export default SupportBtn;
