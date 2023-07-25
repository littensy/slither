import { createCollection } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { PlayerSave, defaultPlayerSave, selectPlayerSave } from "shared/store/saves";
import { promisePlayerDisconnected } from "shared/utils/player-utils";
import { validateSave } from "./validation";

const collection = createCollection<PlayerSave>("player-saves", {
	defaultData: defaultPlayerSave,
	validate: validateSave,
});

async function loadPlayerSave(player: Player) {
	if (player.UserId < 0) {
		// Lapis may misbehave in local test servers, so just
		// load the default data in that case.
		return loadDefaultPlayerSave(player);
	}

	try {
		const document = await collection.load(`${player.UserId}`);

		if (!player.IsDescendantOf(Players)) {
			document.close();
			return;
		}

		const unsubscribe = store.subscribe(selectPlayerSave(player.Name), (save) => {
			if (save) document.write(save);
		});

		promisePlayerDisconnected(player).then(() => {
			document.close();
			unsubscribe();
			store.deletePlayerSave(player.Name);
		});

		store.setPlayerSave(player.Name, document.read());
	} catch (err) {
		warn(`Failed to load data for ${player.Name}: ${err}`);
		loadDefaultPlayerSave(player);
	}
}

async function loadDefaultPlayerSave(player: Player) {
	store.setPlayerSave(player.Name, defaultPlayerSave);

	promisePlayerDisconnected(player).then(() => {
		store.deletePlayerSave(player.Name);
	});
}

Players.PlayerAdded.Connect(loadPlayerSave);

for (const player of Players.GetPlayers()) {
	loadPlayerSave(player);
}
