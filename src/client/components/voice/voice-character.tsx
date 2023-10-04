import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { selectSnakeById } from "shared/store/snakes";
import { Character } from "shared/utils/player-utils";

import { toRealSpace } from "./utils";

interface VoiceCharacterProps {
	readonly player: Player;
	readonly model: Character;
}

export function VoiceCharacter({ player, model }: VoiceCharacterProps) {
	const snake = useSelectorCreator(selectSnakeById, player.Name);

	useEffect(() => {
		if (snake) {
			model.PivotTo(toRealSpace(snake.head));
		}
	}, [snake]);

	useEffect(() => {
		if (!snake) {
			model.PivotTo(new CFrame(100, 200, 100));
		}
	}, [!snake]);

	return <></>;
}
