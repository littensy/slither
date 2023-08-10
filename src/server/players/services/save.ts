import { DataStoreService, Players } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { defaultPlayerSave, playerSaveSchema, selectPlayerSave } from "shared/store/saves";
import { promisePlayerDisconnected } from "shared/utils/player-utils";

const dataStore = DataStoreService.GetDataStore("saves", "v1");

async function main() {
	Players.PlayerAdded.Connect(loadPlayerSave);

	for (const player of Players.GetPlayers()) {
		loadPlayerSave(player);
	}

	setTimeout(() => {
		for (const player of Players.GetPlayers()) {
			saveToDataStore(player);
		}
	}, 60);
}

async function loadPlayerSave(player: Player) {
	try {
		const [save = defaultPlayerSave] = dataStore.GetAsync(`${player.UserId}`);

		if (!player.IsDescendantOf(Players)) {
			return;
		}

		if (!playerSaveSchema(save)) {
			warn(`Invalid save data for ${player.Name}, merging with default save`);
			return fallbackPlayerSave(player, save);
		}

		promisePlayerDisconnected(player).then(() => {
			store.deletePlayerSave(player.Name);
			saveToDataStore(player);
		});

		store.setPlayerSave(player.Name, save);
	} catch (e) {
		warn(`Failed to load data for ${player.Name}: ${e}`);
		fallbackPlayerSave(player);
	}
}

async function fallbackPlayerSave(player: Player, save?: unknown) {
	store.setPlayerSave(player.Name, {
		...defaultPlayerSave,
		...(typeIs(save, "table") && save),
	});

	promisePlayerDisconnected(player).then(() => {
		store.deletePlayerSave(player.Name);
	});
}

async function saveToDataStore(player: Player) {
	const save = store.getState(selectPlayerSave(player.Name));

	if (!save) {
		return;
	}

	try {
		dataStore.SetAsync(`${player.UserId}`, save, [player.UserId]);
	} catch (e) {
		warn(`Failed to auto-save data for ${player.Name}: ${e}`);
	}
}

main();
