import { useDebounceEffect, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import { selectSnakeFromWorldSubject } from "client/store/world";
import { playSound, sounds } from "shared/assets";
import { selectHasLocalSnake, selectSnakeIsBoosting } from "shared/store/snakes";

const ERROR_SOUNDS = [sounds.error_1, sounds.error_2, sounds.error_3];

const random = new Random();

export function WorldSounds() {
	const snake = useSelector(selectSnakeFromWorldSubject);
	const boosting = useSelectorCreator(selectSnakeIsBoosting, snake?.id ?? "");
	const hasLocalSnake = useSelector(selectHasLocalSnake);
	const previousScore = usePrevious(snake?.score);

	const volume = hasLocalSnake ? 0.5 : 0.25;

	// Death sound
	useEffect(() => {
		if (snake?.dead) {
			const index = random.NextInteger(0, ERROR_SOUNDS.size() - 1);
			playSound(ERROR_SOUNDS[index], { volume: 2 * volume });
		}
	}, [snake?.dead]);

	// Spawn sound
	useEffect(() => {
		if (hasLocalSnake) {
			playSound(sounds.start_game);
		}
	}, [hasLocalSnake]);

	// Candy eat sound
	useEffect(() => {
		if ((snake?.score ?? 0) > (previousScore ?? 0)) {
			const speed = random.NextNumber(0.87, 1);
			playSound(sounds.whoosh, { volume: 0.6 * volume, speed });
		}
	}, [snake?.score]);

	// Boost sound
	useDebounceEffect(
		() => {
			if (snake) {
				playSound(boosting ? sounds.boost_start : sounds.boost_stop, { volume });
			}
		},
		[boosting],
		{ wait: 0.25, leading: true },
	);

	return <></>;
}
