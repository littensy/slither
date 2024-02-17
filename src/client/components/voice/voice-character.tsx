import { useInterval } from "@rbxts/pretty-react-hooks";
import React, { useRef } from "@rbxts/react";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { selectSnakeById } from "shared/store/snakes";
import { Character } from "shared/utils/player-utils";

import { toRealSpace } from "./utils";

interface VoiceCharacterProps {
	readonly player: Player;
	readonly model: Character;
}

export function VoiceCharacter({ player, model }: VoiceCharacterProps) {
	const snake = useSelectorCreator(selectSnakeById, player.Name);
	const hidden = useRef<Model>();

	useInterval(() => {
		if (snake) {
			model.PivotTo(toRealSpace(snake.head));
		} else if (hidden.current !== model) {
			model.PivotTo(new CFrame(100, 200, 100));
			hidden.current = model;
		}
	}, 0.2);

	return <></>;
}
