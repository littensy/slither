import { runOnce } from "shared/utils/run-once";

import { initCandyService } from "./candy";
import { initCollisionService } from "./collision";
import { initSnakeService } from "./snakes";

export const initWorldServices = runOnce(async () => {
	initCandyService();
	initCollisionService();
	initSnakeService();
});
