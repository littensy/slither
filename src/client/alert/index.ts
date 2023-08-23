import { throttle } from "@rbxts/set-timeout";
import { store } from "client/store";
import { Alert, AlertScope, selectAlerts } from "client/store/alert";
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

const scopedThrottles: Record<AlertScope, (callback: () => number) => number> = {
	money: throttle((callback) => callback(), 0.8),
	ranking: throttle((callback) => callback(), 0.8),
};

function sendAlertImmediate(patch: Partial<Alert>) {
	const alert: Alert = {
		...defaultAlert,
		...patch,
		id: nextAlertId++,
	};

	if (alert.scope) {
		dismissAlertsOfScope(alert.scope);
	}

	store.addAlert(alert);

	Promise.delay(alert.duration).then(() => {
		dismissAlert(alert.id);
	});

	return alert.id;
}

export function sendAlert(patch: Partial<Alert>) {
	if (!patch.scope) {
		return sendAlertImmediate(patch);
	}

	return scopedThrottles[patch.scope](() => {
		return sendAlertImmediate(patch);
	});
}

export async function dismissAlert(id: number) {
	store.setAlertVisible(id, false);

	return Promise.delay(0.25).then(() => {
		store.removeAlert(id);
		return id;
	});
}

function dismissAlertsOfScope(scope: string) {
	for (const alert of store.getState(selectAlerts)) {
		if (alert.scope === scope) {
			dismissAlert(alert.id);
		}
	}
}
