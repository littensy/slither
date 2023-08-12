import { store } from "server/store";
import { palette } from "shared/data/palette";
import { findSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { RANDOM_SKIN, selectPlayerBalance, selectPlayerSkins } from "shared/store/saves";

remotes.save.buySkin.connect((player, skinId) => {
	const skin = findSnakeSkin(skinId);
	const balance = store.getState(selectPlayerBalance(player.Name));

	if (skin && balance !== undefined && balance >= skin.price) {
		store.givePlayerSkin(player.Name, skinId);
		store.givePlayerBalance(player.Name, -skin.price);
		remotes.client.alert.fire(player, {
			emoji: "💵",
			color: palette.green,
			message: `You bought the ${skin.id} skin for $${skin.price}, thank you!`,
		});
	} else {
		remotes.client.alert.fire(player, {
			emoji: "🚨",
			color: palette.red,
			message: `Sorry, you cannot afford the ${skinId} skin yet.`,
		});
	}
});

remotes.save.setSkin.connect((player, skinId) => {
	const skin = findSnakeSkin(skinId);
	const inventory = store.getState(selectPlayerSkins(player.Name));

	if (inventory?.includes(skinId)) {
		store.setPlayerSkin(player.Name, skinId);
		remotes.client.alert.fire(player, {
			emoji: "🌈",
			color: skin?.primary || skin?.tint[0] || palette.mauve,
			colorSecondary: skin?.secondary || (skinId === RANDOM_SKIN ? palette.blue : undefined),
			colorMessage: skin?.primary || skin?.tint[0] || palette.mauve,
			message:
				skinId === RANDOM_SKIN
					? "You are now wearing a random skin!"
					: `You are now wearing the ${skinId} skin!`,
		});
	} else {
		remotes.client.alert.fire(player, {
			emoji: "🚨",
			color: palette.red,
			message: `Sorry, you do not own the ${skinId} skin.`,
		});
	}
});
