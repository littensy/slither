import { remotes } from "shared/remotes";

import { sendAlert } from "../alert-factory";

export function connectRemoteAlerts() {
	remotes.client.alert.connect((alert) => {
		sendAlert(alert);
	});
}
