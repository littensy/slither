import { runOnce } from "shared/utils/run-once";

import { initBadgeService } from "./badges";
import { initMilestoneService } from "./milestones";
import { initRewardService } from "./rewards";

export const initRewardServices = runOnce(async () => {
	initBadgeService();
	initMilestoneService();
	initRewardService();
});
