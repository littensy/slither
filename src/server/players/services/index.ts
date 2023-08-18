import { initCharacterService } from "./character";
import { initRemoteService } from "./remotes";
import { initSaveService } from "./save";
import { initScoreboardService } from "./scoreboard";

export async function initPlayerServices() {
	initCharacterService();
	initRemoteService();
	initSaveService();
	initScoreboardService();
}
