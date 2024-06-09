import { store } from "server/store";
import { selectPlayerBalance } from "shared/store/saves";
import { selectSnakeById } from "shared/store/snakes";
import { onPlayerAdded, promisePlayerDisconnected } from "shared/utils/player-utils";

export async function initScoreboardService() {
	onPlayerAdded((player) => {
		const stats = new Instance("Folder");
		stats.Name = "leaderstats";
		stats.Parent = player;

		const knockouts = new Instance("IntValue");
		knockouts.Name = "☠️ KOs";
		knockouts.Parent = stats;

		const score = new Instance("IntValue");
		score.Name = "💯 Score";
		score.Parent = stats;

		const cash = new Instance("IntValue");
		cash.Name = "💵 Cash";
		cash.Parent = stats;

		const unsubscribeFromScoreAndKnockoutsUpdate = store.subscribe(selectSnakeById(player.Name), (snake) => {
			score.Value = snake ? snake.score : 0;
			knockouts.Value = snake ? snake.eliminations : 0;
		});

		const unsubscribeFromCashUpdate = store.subscribe(selectPlayerBalance(player.Name), (balance) => {
			cash.Value = balance ?? 0;
		});

		promisePlayerDisconnected(player).then(() => {
			unsubscribeFromScoreAndKnockoutsUpdate();
			unsubscribeFromCashUpdate();
		});
	});
}
