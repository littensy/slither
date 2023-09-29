import { store } from "server/store";
import { identifySnake, selectPlayerSnakesById, selectSnakeRanking, selectSnakeScore } from "shared/store/snakes";

import { shouldGrantReward } from "../utils";

export async function initMilestoneService() {
	store.observe(selectPlayerSnakesById, identifySnake, (snake) => {
		return observePlayer(snake.id);
	});
}

function observePlayer(id: string) {
	const unsubscribeRanking = store.subscribe(selectSnakeRanking(id), (ranking) => {
		if (ranking !== undefined && shouldGrantReward()) {
			store.setMilestoneRank(id, ranking);
		}
	});

	const unsubscribeScore = store.subscribe(selectSnakeScore(id), (score) => {
		if (score !== undefined && shouldGrantReward()) {
			store.setMilestoneScore(id, score);
		}
	});

	store.addMilestone(id);

	return () => {
		unsubscribeRanking();
		unsubscribeScore();
		store.removeMilestone(id);
	};
}
