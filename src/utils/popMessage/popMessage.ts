import { message } from "antd";
import classes from "./popMessage.module.scss";

export const popMessage = () => {
	const [messageApi, ctxMessage] = message.useMessage();

	const popSuccess = (mess: string, duration = 3) => {
		messageApi.open({
			type: "success",
			content: mess,
			className: classes.popSuccess,
			duration,
		});
	};

	const popError = (mess: string, duration = 3) => {
		messageApi.open({
			type: "error",
			content: mess,
			className: classes.popError,
			duration,
		});
	};

	return { popSuccess, popError, ctxMessage };
};
