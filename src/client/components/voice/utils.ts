import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useEffect, useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { Character, promiseCharacter } from "shared/utils/player-utils";

interface VoiceCharacter {
	readonly player: Player;
	readonly model: Character;
}

export function useVoiceCharacters() {
	const [characters, setCharacters] = useState<VoiceCharacter[]>([]);

	const characterAdded = async (model: Model) => {
		const character = await promiseCharacter(model).timeout(60, `Took too long to load character ${model}`);
		const player = Players.GetPlayerFromCharacter(character);

		if (player) {
			setCharacters((characters) => [...characters, { player, model: character }]);
		}
	};

	const characterRemoving = (model: Model) => {
		setCharacters((characters) => {
			return characters.filter((character) => character.model !== model);
		});
	};

	const playerAdded = async (player: Player) => {
		if (player.Character) {
			characterAdded(player.Character);
		}

		player.CharacterAdded.Connect(characterAdded);
		player.CharacterRemoving.Connect(characterRemoving);
	};

	const playerRemoving = (player: Player) => {
		setCharacters((characters) => {
			return characters.filter((character) => character.player !== player);
		});
	};

	useEventListener(Players.PlayerAdded, playerAdded);

	useEventListener(Players.PlayerRemoving, playerRemoving);

	useEffect(() => {
		for (const player of Players.GetPlayers()) {
			playerAdded(player);
		}
	}, []);

	return characters;
}

export function toRealSpace(position: Vector2) {
	return new CFrame(2 * position.X, 0, 2 * position.Y);
}
