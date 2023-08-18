import { store } from "client/store";
import { Alert } from "client/store/alert";
import { palette } from "shared/data/palette";
import { remotes } from "shared/remotes";
import { selectLocalSnakeRanking } from "shared/store/snakes";

import { dismissAlert, sendAlert } from ".";

const FIRST_PLACE = 'Congratulations, you are in <font color="#fff">first place</font>!';
const SECOND_PLACE = 'Congratulations, you are in <font color="#fff">second place</font>!';
const THIRD_PLACE = 'Congratulations, you are in <font color="#fff">third place</font>!';

let previousAlertId = 0;

function sendAlertLimited(alert: Partial<Alert>) {
	dismissAlert(previousAlertId);
	previousAlertId = sendAlert(alert);
}

remotes.client.alert.connect((alert) => {
	sendAlert(alert);
});

store.subscribe(selectLocalSnakeRanking, (ranking) => {
	if (ranking === 1) {
		sendAlertLimited({
			emoji: "🏆",
			color: palette.yellow,
			colorSecondary: palette.peach,
			message: FIRST_PLACE,
		});
	} else if (ranking === 2) {
		sendAlertLimited({
			emoji: "🥈",
			color: palette.sapphire,
			colorSecondary: palette.blue,
			message: SECOND_PLACE,
		});
	} else if (ranking === 3) {
		sendAlertLimited({
			emoji: "🥉",
			color: palette.maroon,
			colorSecondary: palette.red,
			message: THIRD_PLACE,
		});
	}
});
