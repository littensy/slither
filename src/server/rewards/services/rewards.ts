import { Players } from "@rbxts/services";
import { store } from "server/store";
import {
	identifyMilestone,
	ScoreMilestone,
	selectMilestoneLastKilled,
	selectMilestoneRanking,
	selectMilestones,
	selectMilestoneScore,
} from "server/store/milestones";
import { getSnake } from "server/world";
import { palette } from "shared/data/palette";
import { remotes } from "shared/remotes";
import { describeSnakeFromScore } from "shared/store/snakes";

const SCORE_REWARD_TABLE: { readonly [K in ScoreMilestone]: number } = {
	1_000: 20,
	5_000: 50,
	10_000: 100,
	25_000: 200,
	50_000: 500,
	100_000: 1_000,
	250_000: 2_500,
	500_000: 5_000,
	1_000_000: 10_000,
};

const RANK_REWARD_TABLE: { readonly [ranking: number]: number | undefined } = {
	1: 200,
	2: 100,
	3: 50,
};

export async function initRewardService() {
	store.observe(selectMilestones, identifyMilestone, (milestone, id) => {
		return observeMilestone(id);
	});
}

function observeMilestone(id: string) {
	const unsubscribeRanking = store.subscribe(selectMilestoneRanking(id), (ranking = 0) => {
		const reward = RANK_REWARD_TABLE[ranking];

		if (reward !== undefined) {
			grantReward(id, reward, `making <font color="#fff">top ${ranking}</font>`);
		}
	});

	const unsubscribeScore = store.subscribe(selectMilestoneScore(id), (score) => {
		const reward = score && SCORE_REWARD_TABLE[score];

		if (reward !== undefined) {
			grantReward(id, reward, `hitting a score of <font color="#fff">${score}</font>`);
		}
	});

	const unsubscribeKill = store.observeWhile(selectMilestoneLastKilled(id), (enemyId) => {
		const enemy = getSnake(enemyId);

		if (enemy) {
			const length = describeSnakeFromScore(enemy.score).length;
			grantReward(id, math.ceil(length), `defeating <font color="#fff">${enemy.name}</font>`);
		}

		store.clearMilestoneKillScore(id);
	});

	return () => {
		unsubscribeRanking();
		unsubscribeScore();
		unsubscribeKill();
	};
}

function grantReward(id: string, reward: number, reason: string) {
	const player = Players.FindFirstChild(id);

	if (!player?.IsA("Player")) {
		return;
	}

	store.givePlayerBalance(id, reward);

	// Delay the alert so that it doesn't appear at the same time as
	// other alerts
	Promise.delay(0.5).then(() => {
		remotes.client.alert.fire(player, {
			scope: "money",
			emoji: "💵",
			color: palette.green,
			message: `You got <font color="#fff">$${reward}</font> for ${reason}!`,
		});
	});
}
