import { store } from "server/store";
import { IS_CANARY } from "shared/constants";
import {
	identifySnake,
	selectPlayerCountIsAbove,
	selectPlayerSnakesById,
	selectSnakeRanking,
	selectSnakeScore,
} from "shared/store/snakes";

export async function initMilestoneService() {
	store.observe(selectPlayerSnakesById, identifySnake, (snake) => {
		return observePlayer(snake.id);
	});
}

function observePlayer(id: string) {
	const unsubscribeRanking = store.subscribe(selectSnakeRanking(id), (ranking) => {
		if (ranking !== undefined && shouldRewardMilestone()) {
			store.setMilestoneRank(id, ranking);
		}
	});

	const unsubscribeScore = store.subscribe(selectSnakeScore(id), (score) => {
		if (score !== undefined && shouldRewardMilestone()) {
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

function shouldRewardMilestone() {
	return IS_CANARY || store.getState(selectPlayerCountIsAbove(5));
}
