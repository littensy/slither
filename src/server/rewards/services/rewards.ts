import { Players } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
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
import { sounds } from "shared/assets";
import { palette } from "shared/data/palette";
import { remotes } from "shared/remotes";
import { describeSnakeFromScore, selectSnakeRanking } from "shared/store/snakes";

import { grantMoney } from "../utils";

const SCORE_REWARDS: { readonly [K in ScoreMilestone]: number } = {
	1_000: 20,
	5_000: 50,
	10_000: 100,
	25_000: 250,
	50_000: 500,
	100_000: 1_000,
	250_000: 2_500,
	500_000: 5_000,
	1_000_000: 10_000,
};

const RANK_REWARDS: { readonly [ranking: number]: number | undefined } = {
	1: 100,
	2: 75,
	3: 50,
};

const RANK_REWARDS_PASSIVE: { readonly [ranking: number]: number | undefined } = {
	1: 20,
	2: 10,
	3: 5,
};

export async function initRewardService() {
	store.observe(selectMilestones, identifyMilestone, (milestone, id) => {
		return observeRewards(id);
	});
}

function observeRewards(id: string) {
	// When the player hits a new top ranking they haven't hit
	// during their current life, grant them a reward
	const unsubscribeRanking = store.subscribe(selectMilestoneRanking(id), (ranking = 0) => {
		const reward = RANK_REWARDS[ranking];

		if (reward !== undefined) {
			grantMoneyReward(id, reward, `making <font color="#fff">top ${ranking}</font>`);
		}
	});

	// When the player hits a new score milestone they haven't hit
	// during their current life, grant them a reward
	const unsubscribeScore = store.subscribe(selectMilestoneScore(id), (score) => {
		const reward = score && SCORE_REWARDS[score];

		if (reward !== undefined) {
			grantMoneyReward(id, reward, `hitting a score of <font color="#fff">${score}</font>`);
		}
	});

	// When the player kills a snake, grant them a reward based on the
	// length of the snake they killed
	const unsubscribeKill = store.observeWhile(selectMilestoneLastKilled(id), (enemyId) => {
		const enemy = getSnake(enemyId);

		if (enemy) {
			const length = describeSnakeFromScore(enemy.score).length;
			const bounty = math.floor(length / 2);
			grantMoneyReward(id, bounty, `defeating <font color="#fff">${enemy.name}</font>`);
		}

		store.clearMilestoneKillScore(id);
	});

	// While the player is in the top 3, grant them a reward every minute
	// as long as they stay in the top 3
	const unsubscribePassive = store.observeWhile(
		selectSnakeRanking(id),
		(rank = 4) => rank <= 3,
		() => {
			return setInterval(() => {
				const rank = store.getState(selectSnakeRanking(id)) ?? 0;
				const reward = RANK_REWARDS_PASSIVE[rank];

				if (reward !== undefined) {
					grantMoneyReward(id, reward, `staying in the <font color="#fff">top ${rank}</font>`);
				}
			}, 180);
		},
	);

	return () => {
		unsubscribeRanking();
		unsubscribeScore();
		unsubscribeKill();
		unsubscribePassive();
	};
}

function grantMoneyReward(id: string, amount: number, reason: string) {
	const player = Players.FindFirstChild(id);

	if (!player?.IsA("Player")) {
		return;
	}

	amount = grantMoney(player, amount);

	// Delay the alert so that it doesn't appear at the same time as
	// other alerts
	Promise.delay(0.5).then(() => {
		remotes.client.alert.fire(player, {
			scope: "money",
			emoji: "💵",
			color: palette.green,
			message: `You got <font color="#fff">$${amount}</font> for ${reason}!`,
			sound: sounds.alert_money,
		});
	});
}
