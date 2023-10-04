import { remotes } from "shared/remotes";

import { sendAlert } from ".";

remotes.client.alert.connect((alert) => {
	sendAlert(alert);
});
