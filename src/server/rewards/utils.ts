import { store } from "server/store";
import { PREMIUM_BENEFIT } from "shared/constants";

export function grantMoney(player: Player, amount: number) {
	if (player.MembershipType === Enum.MembershipType.Premium) {
		amount *= PREMIUM_BENEFIT;
	}

	store.givePlayerBalance(player.Name, math.floor(amount));

	return amount;
}
