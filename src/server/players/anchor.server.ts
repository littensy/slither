import { Players } from "@rbxts/services";
import { Character, promiseCharacter, promisePlayerDisconnected } from "shared/utils/player-utils";

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

Players.PlayerAdded.Connect((player) => {
	const characterAdded = player.CharacterAdded.Connect((character) => {
		promiseCharacter(character).then(onSpawn);
	});

	promisePlayerDisconnected(player).then(() => {
		characterAdded.Disconnect();
	});
});
