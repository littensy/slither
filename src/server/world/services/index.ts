import { runOnce } from "shared/utils/run-once";

import { initBotService } from "./bots";
import { initCandyService } from "./candy";
import { initCollisionService } from "./collision";
import { initSnakeService } from "./snakes";

export const initWorldServices = runOnce(async () => {
	initBotService();
	initCandyService();
	initCollisionService();
	initSnakeService();
});
