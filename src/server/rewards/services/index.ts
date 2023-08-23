import { runOnce } from "shared/utils/run-once";

import { initMilestoneService } from "./milestones";
import { initRewardService } from "./rewards";

export const initRewardServices = runOnce(async () => {
	initMilestoneService();
	initRewardService();
});
