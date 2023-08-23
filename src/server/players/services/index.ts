import { runOnce } from "shared/utils/run-once";

import { initCharacterService } from "./character";
import { initRemoteService } from "./remotes";
import { initSaveService } from "./save";
import { initScoreboardService } from "./scoreboard";

export const initPlayerServices = runOnce(async () => {
	initCharacterService();
	initRemoteService();
	initSaveService();
	initScoreboardService();
});
