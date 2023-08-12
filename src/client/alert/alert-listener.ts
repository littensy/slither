import { remotes } from "shared/remotes";

import { sendAlert } from "./alert";

remotes.client.alert.connect((alert) => {
	sendAlert(alert);
});
