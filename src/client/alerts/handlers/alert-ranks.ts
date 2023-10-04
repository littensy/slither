import { store } from "client/store";
import { palette } from "shared/constants/palette";
import { selectLocalSnakeRanking } from "shared/store/snakes";

import { sendAlert } from "../alert-factory";

const FIRST_PLACE = 'Congratulations! You are in <font color="#fff">first place</font>.';
const SECOND_PLACE = 'Congratulations! You are in <font color="#fff">second place</font>.';
const THIRD_PLACE = 'Congratulations! You are in <font color="#fff">third place</font>.';

export function connectRankAlerts() {
	store.subscribe(selectLocalSnakeRanking, (ranking) => {
		if (ranking === 1) {
			sendAlert({
				scope: "ranking",
				emoji: "🏆",
				color: palette.yellow,
				colorSecondary: palette.peach,
				message: FIRST_PLACE,
			});
		} else if (ranking === 2) {
			sendAlert({
				scope: "ranking",
				emoji: "🥈",
				color: palette.sapphire,
				colorSecondary: palette.blue,
				message: SECOND_PLACE,
			});
		} else if (ranking === 3) {
			sendAlert({
				scope: "ranking",
				emoji: "🥉",
				color: palette.maroon,
				colorSecondary: palette.red,
				message: THIRD_PLACE,
			});
		}
	});
}
