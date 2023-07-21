import { Players } from "@rbxts/services";
import { Character, promiseCharacter } from "shared/utils/player-utils";

/**
 * Disable death and animations for the character to allow clients to
 * manipulate the character without the server interfering.
 * TODO: Position chat bubbles above game UI on the client
 */
function onSpawn(character: Character) {
	character.HumanoidRootPart.SetNetworkOwner(undefined);
	character.HumanoidRootPart.Anchored = true;
	character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Dead, false);
}

function onPlayerAdded(player: Player) {
	const characterAdded = player.CharacterAdded.Connect((character) => {
		promiseCharacter(character).then(onSpawn);
	});

	Promise.fromEvent(Players.PlayerRemoving, (playerLeft) => player === playerLeft).then(() => {
		characterAdded.Disconnect();
	});
}

Players.PlayerAdded.Connect(onPlayerAdded);

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}
