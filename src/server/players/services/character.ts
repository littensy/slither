import { Players } from "@rbxts/services";
import { Character, promiseCharacter, promisePlayerDisconnected } from "shared/utils/player-utils";

export async function initCharacterService() {
	function onSpawn(character: Character) {
		character.HumanoidRootPart.SetNetworkOwner(undefined);
		character.HumanoidRootPart.Anchored = true;
		character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Dead, false);
	}

	Players.PlayerAdded.Connect((player) => {
		const characterAdded = player.CharacterAdded.Connect((character) => {
			promiseCharacter(character).then(onSpawn);

			player.ClearCharacterAppearance();
		});

		promisePlayerDisconnected(player).then(() => {
			characterAdded.Disconnect();
		});
	});
}
