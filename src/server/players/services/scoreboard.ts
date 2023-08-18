import { Players } from "@rbxts/services";
import { store } from "server/store";
import { selectSnakeById } from "shared/store/snakes";
import { promisePlayerDisconnected } from "shared/utils/player-utils";

export async function initScoreboardService() {
	Players.PlayerAdded.Connect((player) => {
		const stats = new Instance("Folder");
		stats.Name = "leaderstats";
		stats.Parent = player;

		const score = new Instance("IntValue");
		score.Name = "Score";
		score.Parent = stats;

		const unsubscribe = store.subscribe(selectSnakeById(player.Name), (snake) => {
			score.Value = snake ? snake.score : 0;
		});

		promisePlayerDisconnected(player).then(() => {
			unsubscribe();
		});
	});
}
