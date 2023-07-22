import { useAsync, useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/roact";
import { Character, promiseCharacter } from "shared/utils/player-utils";

export function useCharacter(player: Player): Character | undefined {
	const [model, setModel] = useState(player.Character);

	const [character] = useAsync(async () => {
		return model && promiseCharacter(model);
	}, [model]);

	useEventListener(player.CharacterAdded, (character) => {
		setModel(character);
	});

	useEventListener(player.CharacterRemoving, () => {
		setModel(undefined);
	});

	return character;
}
