import { store } from "server/store";
import { PREMIUM_BENEFIT } from "shared/constants";

export function grantMoney(player: Player, amount: number) {
	if (player.MembershipType === Enum.MembershipType.Premium) {
		amount = math.round(amount * PREMIUM_BENEFIT);
	} else {
		amount = math.round(amount);
	}
	store.givePlayerBalance(player.Name, amount);

	return amount;
}
