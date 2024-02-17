import React, { useEffect } from "@rbxts/react";

import { useTouchMove } from "../utils/use-touch-move";

interface TouchProps {
	readonly updateAngle: (angle: number) => void;
	readonly setBoost: (boost: boolean) => void;
}

export function Touch({ updateAngle, setBoost }: TouchProps) {
	const [direction, jumping] = useTouchMove();

	useEffect(() => {
		if (direction !== Vector2.zero) {
			const angle = math.atan2(direction.Y, direction.X);
			updateAngle(angle);
		}
	}, [direction]);

	useEffect(() => {
		setBoost(jumping);
	}, [jumping]);

	return <></>;
}
