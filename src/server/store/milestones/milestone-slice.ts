import { createProducer } from "@rbxts/reflex";
import { mapProperty } from "shared/utils/object-utils";

export type MilestoneState = {
	readonly [K in string]?: MilestoneEntity;
};

export interface MilestoneEntity {
	readonly topScore?: ScoreMilestone;
	readonly topRank: number;
	readonly lastKilled?: string;
}

export type ScoreMilestone = (typeof SCORE_MILESTONES)[number];

export const SCORE_MILESTONES = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000] as const;

const SCORE_MILESTONES_REVERSE = SCORE_MILESTONES.reduce<ScoreMilestone[]>((acc, score, index) => {
	acc[SCORE_MILESTONES.size() - index] = score;
	return acc;
}, []);

const defaultEntity: MilestoneEntity = {
	topRank: 4,
};

const initialState: MilestoneState = {};

export const milestoneSlice = createProducer(initialState, {
	addMilestone: (state, playerId: string) => ({
		...state,
		[playerId]: { ...defaultEntity },
	}),

	removeMilestone: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	clearMilestoneKillScore: (state, playerId: string) => {
		return mapProperty(state, playerId, (milestone) => ({
			...milestone,
			lastKilled: undefined,
		}));
	},

	setMilestoneRank: (state, playerId: string, ranking: number) => {
		return mapProperty(state, playerId, (milestone) => ({
			...milestone,
			topRank: math.min(ranking, milestone.topRank),
		}));
	},

	setMilestoneScore: (state, playerId: string, score: number) => {
		return mapProperty(state, playerId, (milestone) => {
			const nextMilestone = math.max(
				SCORE_MILESTONES_REVERSE.find((milestone) => score >= milestone) || 0,
				milestone.topScore || 0,
			);

			if (nextMilestone === 0) {
				return milestone;
			}

			return {
				...milestone,
				topScore: nextMilestone as ScoreMilestone,
			};
		});
	},

	playerKilledSnake: (state, playerId: string, lastKilled: string) => {
		return mapProperty(state, playerId, (milestone) => ({
			...milestone,
			lastKilled,
		}));
	},
});
