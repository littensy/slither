import { store } from "client/store";
import { Alert } from "client/store/alert";
import { palette } from "shared/data/palette";
import { remotes } from "shared/remotes";
import { selectLocalSnakeRanking } from "shared/store/snakes";

import { dismissAlert, sendAlert } from "./alert";

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
			message: "Congratulations, you are in first place!",
		});
	} else if (ranking === 2) {
		sendAlertLimited({
			emoji: "🥈",
			color: palette.sapphire,
			colorSecondary: palette.blue,
			message: "Congratulations, you are in second place!",
		});
	} else if (ranking === 3) {
		sendAlertLimited({
			emoji: "🥉",
			color: palette.maroon,
			colorSecondary: palette.red,
			message: "Congratulations, you are in third place!",
		});
	}
});
