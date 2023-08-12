import { store } from "client/store";
import { Alert } from "client/store/alert";
import { palette } from "shared/data/palette";

const defaultAlert: Alert = {
	id: 0,
	emoji: "✅",
	message: "Alert",
	color: palette.green,
	duration: 5,
	visible: true,
};

let nextAlertId = 0;

export async function sendAlert(patch: Partial<Alert>) {
	const alert: Alert = {
		...defaultAlert,
		...patch,
		id: nextAlertId++,
	};

	store.addAlert(alert);

	return Promise.delay(alert.duration).then(() => {
		dismissAlert(alert.id);
	});
}

export async function dismissAlert(id: number) {
	store.setAlertVisible(id, false);

	return Promise.delay(0.25).then(() => {
		store.removeAlert(id);
	});
}
