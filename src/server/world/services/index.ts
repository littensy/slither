import { registerBotService } from "./bots";
import { registerCandyService } from "./candy";
import { registerCollisionService } from "./collision";
import { registerSnakeService } from "./snakes";

export * from "./bots";
export * from "./candy";
export * from "./collision";
export * from "./snakes";

export function registerServices() {
	registerBotService();
	registerCandyService();
	registerCollisionService();
	registerSnakeService();
}
