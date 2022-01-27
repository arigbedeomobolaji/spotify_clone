function formatNumber(num: number): string {
	return num < 10 ? '0' + num : num.toString();
}

export default function milliToMinute(milli: number): string {
	const date = new Date(milli);
	const oneHourInMilli = 1 * 60 * 60 * 1000;

	return milli >= oneHourInMilli
		? `${formatNumber(date.getHours())}:${formatNumber(
				date.getMinutes()
		  )}:${formatNumber(date.getSeconds())}`
		: `${formatNumber(date.getMinutes())}:${formatNumber(
				date.getSeconds()
		  )}`;
}
