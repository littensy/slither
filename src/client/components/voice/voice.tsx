import Roact, { useMemo } from "@rbxts/roact";
import { Players } from "@rbxts/services";

import { useVoiceCharacters } from "./utils";
import { VoiceCamera } from "./voice-camera";
import { VoiceCharacter } from "./voice-character";

export function Voice() {
	const characters = useVoiceCharacters();

	const charactersExcludingSelf = useMemo(() => {
		return characters.filter((voiceCharacter) => {
			return voiceCharacter.player !== Players.LocalPlayer;
		});
	}, [characters]);

	return (
		<>
			<VoiceCamera key="local-camera" />

			{charactersExcludingSelf.map(({ player, model }) => (
				<VoiceCharacter key={player.Name} player={player} model={model} />
			))}
		</>
	);
}
