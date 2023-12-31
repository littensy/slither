import { createCollection } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { sounds } from "shared/assets";
import { palette } from "shared/constants/palette";
import { remotes } from "shared/remotes";
import { defaultPlayerSave, playerSaveSchema, selectPlayerSave } from "shared/store/saves";
import { onPlayerAdded, promisePlayerDisconnected } from "shared/utils/player-utils";

const collection = createCollection("players", {
	defaultData: defaultPlayerSave,
	validate: playerSaveSchema,
});

export async function initSaveService() {
	onPlayerAdded(loadPlayerSave);
}

async function loadPlayerSave(player: Player) {
	try {
		const document = await collection.load(`${player.UserId}`);

		if (!player.IsDescendantOf(Players)) {
			return document.close();
		}

		const disconnect = store.subscribe(selectPlayerSave(player.Name), (newSave) => {
			if (newSave) {
				document.write(newSave);
			}
		});

		promisePlayerDisconnected(player).then(() => {
			store.deletePlayerSave(player.Name);
			disconnect();
			document.close();
		});

		store.setPlayerSave(player.Name, document.read());
	} catch (e) {
		warn(`Failed to load data for ${player.Name}: ${e}`);
		fallbackPlayerSave(player);
	}
}

async function fallbackPlayerSave(player: Player) {
	promisePlayerDisconnected(player).then(() => {
		store.deletePlayerSave(player.Name);
	});

	store.setPlayerSave(player.Name, defaultPlayerSave);

	remotes.client.alert.fire(player, {
		emoji: "🚨",
		color: palette.red,
		message: "Roblox may be having issues with your save data. Sorry for the inconvenience!",
		duration: 10,
		sound: sounds.alert_bad,
	});
}
