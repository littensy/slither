import { store } from "server/store";
import { findSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { selectPlayerBalance, selectPlayerSkins } from "shared/store/saves";

remotes.save.buySkin.connect((player, skinId) => {
	const skin = findSnakeSkin(skinId);
	const balance = store.getState(selectPlayerBalance(player.Name));

	if (skin && balance !== undefined && balance >= skin.price) {
		store.givePlayerSkin(player.Name, skinId);
		store.givePlayerBalance(player.Name, -skin.price);
	}
});

remotes.save.setSkin.connect((player, skinId) => {
	const inventory = store.getState(selectPlayerSkins(player.Name));

	if (inventory?.includes(skinId)) {
		store.setPlayerSkin(player.Name, skinId);
	}
});
