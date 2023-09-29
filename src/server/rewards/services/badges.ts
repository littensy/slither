import { BadgeService } from "@rbxts/services";
import { store } from "server/store";
import {
	identifyMilestone,
	ScoreMilestone,
	selectMilestoneRanking,
	selectMilestones,
	selectMilestoneScore,
} from "server/store/milestones";
import { Badge } from "shared/assets";
import { getPlayerByName } from "shared/utils/player-utils";

import { shouldGrantBadge } from "../utils";

const RANKING_BADGES: { [K in number]?: Badge } = {
	1: Badge.FIRST_PLACE,
	2: Badge.SECOND_PLACE,
	3: Badge.FIRST_PLACE,
};

const SCORE_BADGES: { [K in ScoreMilestone]?: Badge } = {
	25_000: Badge.SCORE_25000,
	50_000: Badge.SCORE_50000,
	100_000: Badge.SCORE_100000,
};

export async function initBadgeService() {
	store.observe(selectMilestones, identifyMilestone, (_, id) => {
		return observeMilestone(id);
	});
}

function observeMilestone(id: string) {
	const unsubscribeRanking = store.subscribe(selectMilestoneRanking(id), (ranking) => {
		if (ranking !== undefined && ranking in RANKING_BADGES) {
			tryGrantBadge(id, RANKING_BADGES[ranking]!);
		}
	});

	const unsubscribeScore = store.subscribe(selectMilestoneScore(id), (score) => {
		if (score !== undefined && score in SCORE_BADGES) {
			tryGrantBadge(id, SCORE_BADGES[score]!);
		}
	});

	return () => {
		unsubscribeRanking();
		unsubscribeScore();
	};
}

async function tryGrantBadge(playerName: string, badgeId: number) {
	const player = getPlayerByName(playerName);

	if (player && shouldGrantBadge()) {
		try {
			BadgeService.AwardBadge(player.UserId, badgeId);
		} catch (e) {
			warn(`Failed to grant badge ${Badge[badgeId]} to ${player}: ${e}`);
		}
	}
}
