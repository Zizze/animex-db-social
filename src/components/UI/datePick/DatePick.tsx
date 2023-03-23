import { DatePicker } from "antd";
import { FC } from "react";
import classes from "./DatePick.module.scss";
import type { DatePickerProps } from "antd/es/date-picker";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

interface IProps {
	getDate: (date: Timestamp) => void;
	classnames?: string;
}

const DatePick: FC<IProps> = ({ getDate, classnames }) => {
	const onChange = (value: DatePickerProps["value"], dateString: [string, string] | string) => {
		// if (value) {
		// 	const timestampNow = Timestamp.now();
		// 	const timestampToBlock = Timestamp.fromDate(value.toDate());
		// 	console.log(timestampNow > timestampToBlock);
		// }

		if (value) {
			const timestampToBlock = Timestamp.fromDate(value.toDate());
			getDate(timestampToBlock);
		}
	};

	const disabledDate = (current: any) => {
		const currentDate = dayjs(current);
		const serverTime = Timestamp.now().toDate();
		const currentServerTime = dayjs(serverTime);
		return currentDate.isBefore(currentServerTime, "minute");
	};

	return (
		<div className={classnames}>
			<DatePicker
				size="large"
				inputReadOnly
				showSecond={false}
				showTime
				onChange={onChange}
				className={classes.picker}
				disabledDate={disabledDate}
			/>
		</div>
	);
};

export default DatePick;
