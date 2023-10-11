import { Character, onPlayerAdded, promiseCharacter, promisePlayerDisconnected } from "shared/utils/player-utils";

export async function initCharacterService() {
	function onSpawn(character: Character) {
		character.HumanoidRootPart.SetNetworkOwner(undefined);
		character.HumanoidRootPart.Anchored = true;
		character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Dead, false);

		for (const part of character.GetDescendants()) {
			if (part.IsA("BasePart") || part.IsA("Decal")) {
				part.Transparency = 1;
			}
		}
	}

	onPlayerAdded((player) => {
		const characterAdded = player.CharacterAdded.Connect((character) => {
			promiseCharacter(character).then(onSpawn);

			player.ClearCharacterAppearance();
		});

		promisePlayerDisconnected(player).then(() => {
			characterAdded.Disconnect();
		});
	});
}
