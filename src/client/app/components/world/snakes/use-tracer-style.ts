import { useBindingState, useTimer } from "@rbxts/pretty-react-hooks";
import { useEffect, useMemo } from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { useRem } from "client/app/hooks";
import { brighten } from "client/app/utils/color-utils";

import { SNAKE_ANGLE_OFFSET } from "./constants";
import { SnakeEffectBinding, SnakeLineBinding } from "./use-snake-bindings";

function redden(color: Color3) {
	return color.Lerp(Color3.fromRGB(255, 0, 0), 0.3);
}

export function useTracerStyle(
	line: SnakeLineBinding,
	effects: SnakeEffectBinding,
	index: number,
	tint: Color3,
	boostTint?: Color3,
) {
	const rem = useRem();
	const boostTimer = useTimer();
	const boostActive = useBindingState(effects.map(({ boost }) => boost > 0.01));

	// keep a timer running while boosting to keep animations going
	useEffect(() => {
		if (boostActive) {
			boostTimer.start();
			return;
		}

		return setTimeout(() => {
			boostTimer.stop();
		}, 1);
	}, [boostActive]);

	return useMemo(() => {
		const size = line.map(({ diameter, fromX, fromY, toX, toY }) => {
			const length = new Vector2(fromX - toX, fromY - toY).Magnitude;
			return new UDim2(0, rem(diameter), 0, rem(diameter + length));
		});

		const position = line.map(({ fromX, fromY, toX, toY }) => {
			return new UDim2(0, rem((fromX + toX) / 2), 0, rem((fromY + toY) / 2));
		});

		const rotation = line.map(({ fromX, fromY, toX, toY }) => {
			return math.deg(math.atan2(toY - fromY, toX - fromX) + SNAKE_ANGLE_OFFSET);
		});

		const color = boostTimer.value.map(() => {
			const { boost, dead } = effects.getValue();

			const time = os.clock();
			const highlight = math.sin(15 * time - 0.8 * index);

			return tint.Lerp(brighten(tint, highlight), boost).Lerp(redden(tint), dead);
		});

		const boostColor =
			boostTint &&
			boostTimer.value.map(() => {
				const { boost } = effects.getValue();

				const time = os.clock();
				const highlight = math.sin(15 * time - 0.8 * index);

				return boostTint.Lerp(brighten(boostTint, highlight), boost);
			});

		const transparency = effects.map(({ dead }) => {
			return dead;
		});

		return {
			size,
			position,
			rotation,
			color,
			boostColor,
			transparency,
			boostTimer: boostTimer.value,
			boostActive,
		};
	}, [line, effects, tint, rem, boostActive]);
}
