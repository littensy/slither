import { initBotService } from "./bot-service";
import { initCandyService } from "./candy-service";
import { initCollisionService } from "./collision-service";
import { initSnakeService } from "./snake-service";

/**
 * Starts the services when imported. This is done to ensure only one instance
 * of these services exist at one time, while having some control over when to
 * start them.
 *
 * This is used by:
 * - `server/world/world.server.ts` to run services on game start
 * - `server/test/world/init.spec.ts` to make sure services run before tests
 */
function initServices() {
	initBotService();
	initCandyService();
	initCollisionService();
	initSnakeService();
}

initServices();
