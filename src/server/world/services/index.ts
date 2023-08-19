import { initBotService } from "./bots";
import { initCandyService } from "./candy";
import { initCollisionService } from "./collision";
import { initSnakeService } from "./snakes";

let initialized = false;

export async function initWorldServices() {
	if (initialized) {
		return;
	}

	initialized = true;

	initBotService();
	initCandyService();
	initCollisionService();
	initSnakeService();
}
