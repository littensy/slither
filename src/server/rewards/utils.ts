import { store } from "server/store";
import { IS_CANARY, IS_EDIT, PREMIUM_BENEFIT } from "shared/constants/core";
import { selectPlayerCountIsAbove } from "shared/store/snakes";

export function grantMoney(player: Player, amount: number) {
	if (player.MembershipType === Enum.MembershipType.Premium) {
		amount = math.round(amount * PREMIUM_BENEFIT);
	} else {
		amount = math.round(amount);
	}

	store.givePlayerBalance(player.Name, amount);

	return amount;
}

export function shouldGrantReward() {
	// TODO: use strict behavior once player count is stable
	// return IS_CANARY || IS_EDIT || store.getState(selectPlayerCountIsAbove(5));
	return true;
}

export function shouldGrantBadge() {
	return IS_CANARY || IS_EDIT || store.getState(selectPlayerCountIsAbove(10));
}
