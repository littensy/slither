import { store } from "server/store";
import { palette } from "shared/data/palette";
import { remotes } from "shared/remotes";

import { createProduct } from "./process-receipt";

export async function initMoneyService() {
	createProduct("money_100", (player) => giveMoney(player, 100));
	createProduct("money_250", (player) => giveMoney(player, 250));
	createProduct("money_500", (player) => giveMoney(player, 500));
	createProduct("money_1000", (player) => giveMoney(player, 1000));
	createProduct("money_5000", (player) => giveMoney(player, 5000));
}

function giveMoney(player: Player, amount: number) {
	store.givePlayerBalance(player.Name, amount);

	remotes.client.alert.fire(player, {
		emoji: "💸",
		message: `Your purchase of <font color="#fff">$${amount}</font> succeeded! Thank you  ❤️`,
		color: palette.green,
	});
}
