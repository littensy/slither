import Roact from "@rbxts/roact";

import { useVoiceCharacters } from "./utils";
import { VoiceCamera } from "./voice-camera";
import { VoiceCharacter } from "./voice-character";

export function Voice() {
	const characters = useVoiceCharacters();

	return (
		<>
			<VoiceCamera key="local-camera" />

			{characters.map(({ player, model }) => (
				<VoiceCharacter key={player.Name} player={player} model={model} />
			))}
		</>
	);
}
